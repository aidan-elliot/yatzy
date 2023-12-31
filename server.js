const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;


app.use(express.json());
app.use(express.static('public'));
app.use(cors());

//Sets initial gameState
const initialGameState = {
  dices: Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6)),
  held: Array(5).fill(false),
  rolls: 0,
  scores: {
    upper: {
      Ones: null, Twos: null, Threes: null, Fours: null, Fives: null, Sixes: null
    },
    lower: {
      ThreeOfAKind: null, FourOfAKind: null, FullHouse: null,
      SmallStraight: null, LargeStraight: null, Yahtzee: null, Chance: null
    }
  },
  gameOver: false,
  availableCategories: [],
  finalScores: 0
};

let gameState = { ...initialGameState };

//Determines available scoreboard categories
function calculateAvailableCategories(scores) {
  const availableCategories = [];
  for (const category in scores.upper) {
    if (scores.upper[category] === null) availableCategories.push(category);
  }
  for (const category in scores.lower) {
    if (scores.lower[category] === null) availableCategories.push(category);
  }
  return availableCategories;
}

//Logic to calculate bonus score
function calculateBonus(scores) {
  const upperScoreSum = Object.values(scores.upper).reduce((sum, score) => sum + (score || 0), 0);
  return upperScoreSum >= 63 ? 35 : 0; // Bonus condition, example for Yahtzee
}

//Logic to calculate final score
function calculateFinalScores(scores) {
  let totalScore = calculateBonus(scores);
  for (const score of Object.values(scores.upper)) {
    totalScore += score || 0;
  }
  for (const score of Object.values(scores.lower)) {
    totalScore += score || 0;
  }
  return totalScore;
}

function updateGameState() {
  gameState.availableCategories = calculateAvailableCategories(gameState.scores);
  gameState.finalScores = calculateFinalScores(gameState.scores);
  gameState.bonusScore = calculateBonus(gameState.scores); // Adds bonus score to gameState
}

app.get('/game-state', (req, res) => {
  updateGameState(); // Update available categories and final scores before sending the state
  res.json(gameState);
});

// Endpoint for rolling dice
app.get('/roll-dice', (req, res) => {
  if (gameState.rolls < 3) {
    gameState.dices = gameState.dices.map((dice, idx) =>
      gameState.held[idx] ? dice : 1 + Math.floor(Math.random() * 6)
    );
    gameState.rolls++;
    updateGameState(); // Update game state after rolling the dice
    res.json(gameState);
  } else {
    res.status(400).json({ message: "No more rolls left" });
  }
});

// Endpoint for calculating scores
app.post('/calculate-scores', (req, res) => {
  try {
    const { category } = req.body;
    let score = 0;

    if (category in gameState.scores.upper) {
      score = calculateUpperSectionScore(category, gameState.dices);
      gameState.scores.upper[category] = score;
    } else if (category in gameState.scores.lower) {
      score = calculateLowerSectionScore(category, gameState.dices);
      gameState.scores.lower[category] = score;
    } else {
      // If the category does not exist in either upper or lower sections
      return res.status(400).json({ message: "Invalid category" });
    }

    gameState.rolls = 0;
    gameState.held.fill(false);
    updateGameState(); // Update game state after calculating scores

    // Ensures that the response includes the updated gameState
    res.json({ gameState });
  } catch (error) {
    console.error('Error in calculating scores:', error);
    res.status(500).json({ message: "Internal server error" });
  }
  console.log("Sending gameState to client:", gameState);
  res.json({ gameState });
});

app.post('/reset-turn', (req, res) => {
  if (gameState.rolls >= 3) {
    gameState.rolls = 0;
    gameState.held.fill(false);
    updateGameState(); // Update the game state after resetting the turn
    res.json({ message: "Turn reset", gameState });
  } else {
    res.status(400).json({ message: "Cannot reset turn yet" });
  }
});

//Restores game to initial gameState to start new game
app.post('/reset-game', (req, res) => {
  Object.keys(gameState.scores.upper).forEach(key => gameState.scores.upper[key] = null);
  Object.keys(gameState.scores.lower).forEach(key => gameState.scores.lower[key] = null);

  gameState.dices = Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6));
  gameState.held = Array(5).fill(false);
  gameState.rolls = 0;
  gameState.gameOver = false;
  updateGameState(); // This will also recalculate available categories and final scores

  res.json({ gameState });
});



app.get('/available-categories', (req, res) => {
  res.json({
    availableCategories: calculateAvailableCategories(gameState.scores)
  });
});

// Endpoint to get final scores
app.get('/final-scores', (req, res) => {
  res.json({
    finalScores: calculateFinalScores(gameState.scores)
  });
});


// Function to calculate the score of a specific upper section category based on the dice rolls
const calculateUpperSectionScore = (category, dices) => {
  const categoryValues = {
    Ones: 1,
    Twos: 2,
    Threes: 3,
    Fours: 4,
    Fives: 5,
    Sixes: 6,
  };
  const value = categoryValues[category];
  return dices.reduce((acc, dice) => (dice === value ? acc + value : acc), 0);
};

// Function to calculate the score of a specific lower section category based on the dice rolls
const calculateLowerSectionScore = (category, dices) => {
  const sortedDices = [...dices].sort();
  const diceCount = sortedDices.reduce((acc, dice) => {
    acc[dice] = (acc[dice] || 0) + 1;
    return acc;
  }, {});

  switch (category) {
    case 'ThreeOfAKind':
      return Object.values(diceCount).some(count => count >= 3) ?
        sortedDices.reduce((a, b) => a + b, 0) :
        0;
    case 'FourOfAKind':
      return Object.values(diceCount).some(count => count >= 4) ?
        sortedDices.reduce((a, b) => a + b, 0) :
        0;
    case 'FullHouse':
      return new Set(sortedDices).size === 2 && Object.values(diceCount).includes(3) ?
        25 :
        0;
    case 'SmallStraight':
      const isSmallStraight = checkStraight(sortedDices, 4);
      return isSmallStraight ? 30 : 0;
    case 'LargeStraight':
      const isLargeStraight = checkStraight(sortedDices, 5);
      return isLargeStraight ? 40 : 0;
    case 'Yahtzee':
      return new Set(sortedDices).size === 1 ? 50 : 0;
    case 'Chance':
      return sortedDices.reduce((a, b) => a + b, 0);
    default:
      return 0;
  }
};

//Checks if the dice are a straight
const checkStraight = (sortedDices, length) => {
  for (let i = 0; i <= sortedDices.length - length; i++) {
    const slice = sortedDices.slice(i, i + length);
    const set = new Set(slice);
    if (set.size === length && Math.max(...slice) - Math.min(...slice) === length - 1) {
      return true;
    }
  }
  return false;
};
app.put('/update-held', (req, res) => {
  gameState.held = req.body.held;
  updateGameState(); // Update game state after changing held state
  res.json({ message: "Held state updated", gameState });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});