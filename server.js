const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;


app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const initialGameState = {
  dices: Array.from({
    length: 5
  }, () => 1 + Math.floor(Math.random() * 6)),
  held: [false, false, false, false, false],
  rolls: 0,
  scores: {
    upper: {
      Ones: null,
      Twos: null,
      Threes: null,
      Fours: null,
      Fives: null,
      Sixes: null,
      Total: null,
      Bonus: null
    },
    lower: {
      ThreeOfAKind: null,
      FourOfAKind: null,
      FullHouse: null,
      SmallStraight: null,
      LargeStraight: null,
      Yahtzee: null,
      Chance: null,
      YahtzeeBonus: null,
      TotalLower: null,
      GrandTotal: null
    }
  },
  gameOver: false,
  availableCategories: [],
  finalScores: 0
};

let gameState = {
  ...initialGameState
};

function calculateAvailableCategories(scores) {
  const availableCategories = [];

  // Check upper section categories
  for (const category in scores.upper) {
    if (scores.upper[category] === null) {
      availableCategories.push(category);
    }
  }

  // Check lower section categories
  for (const category in scores.lower) {
    if (scores.lower[category] === null) {
      availableCategories.push(category);
    }
  }

  return availableCategories;
}

function calculateFinalScores(scores) {
  let totalScore = 0;

  // Sum up scores in the upper section
  for (const score of Object.values(scores.upper)) {
    if (score !== null) {
      totalScore += score;
    }
  }

  // Sum up scores in the lower section
  for (const score of Object.values(scores.lower)) {
    if (score !== null) {
      totalScore += score;
    }
  }

  return totalScore;
}

app.get('/game-state', (req, res) => {
  res.json(gameState);
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

// Endpoint for rolling dice
app.get('/roll-dice', (req, res) => {
  if (gameState.rolls < 3) {
    gameState.dices = gameState.dices.map((dice, idx) =>
      gameState.held[idx] ? dice : 1 + Math.floor(Math.random() * 6)
    );
    gameState.rolls++;
  }
  res.json(gameState);
});

// Endpoint for calculating scores
app.post('/calculate-scores', (req, res) => {
  const {
    category
  } = req.body;
  let score = 0;

  if (category in gameState.scores.upper) {
    score = calculateUpperSectionScore(category, gameState.dices);
    gameState.scores.upper[category] = score;
  } else if (category in gameState.scores.lower) {
    score = calculateLowerSectionScore(category, gameState.dices);
    gameState.scores.lower[category] = score;
  }

  // Update game state here if necessary, e.g., reset rolls and held state
  gameState.availableCategories = calculateAvailableCategories(gameState.scores);
  gameState.finalScores = calculateFinalScores(gameState.scores);

  res.json({
    score,
    gameState
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
  const {
    held
  } = req.body; // Array indicating which dice are held
  gameState.held = held;
  res.json({
    message: "Held state updated",
    gameState
  });
});

// Endpoint to reset game
app.post('/reset-game', (req, res) => {
  gameState = {
    ...initialGameState
  };
  res.json({
    message: "Game reset",
    gameState
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});