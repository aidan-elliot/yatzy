import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import './App.css';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';
import GameOverBanner from './GameOverBanner';


function App() {
    // Function to generate an array of 5 random dice values
  const getRandomDiceValues = () => {
    return Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6));
  };
  // State for the dice values  
  const [dices, setDices] = useState(getRandomDiceValues());
  // State for tracking which dice are held
  const [held, setHeld] = useState([false, false, false, false, false]);
  // State for tracking the number of rolls
  const [rolls, setRolls] = useState(0);
  // State for tracking the scores
  const [scores, setScores] = useState({
    upper: {
      Ones: null,
      Twos: null,
      Threes: null,
      Fours: null,
      Fives: null,
      Sixes: null,
      Total: null,
      Bonus: null,
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
      GrandTotal: null,
    },
  });
  // State for tracking available categories for scoring
  const [availableCategories, setAvailableCategories] = useState([]);
  // State for tracking game over status
  const [gameOver, setGameOver] = useState(false);
  // State for tracking final scores after game is over
  const [finalScores, setFinalScores] = useState([]);
  // State to indicate if it's a new game
  const [isNewGame, setIsNewGame] = useState(false);
  // Effect hook to update available categories when scores change
  useEffect(() => {
    const availableCategories = calculateAvailableCategories(scores);
    setAvailableCategories(availableCategories);
  }, [scores]);
  
  // Effect hook to update total scores when individual scores change
  useEffect(() => {
    updateTotals(); 
  }, [scores]);

  // Effect hook to handle game over logic
  useEffect(() => {
    const isGameOver = availableCategories.length === 0;
    setGameOver(isGameOver);

    if (isGameOver) {
      const finalScoresArray = Object.values(scores.upper)
        .concat(Object.values(scores.lower))
        .filter((score) => score !== null);
      setFinalScores(finalScoresArray);
      setIsNewGame(true); 
    } else {
      setIsNewGame(false); 
    }
  }, [availableCategories, scores]);

  // Function to toggle holding a die
  const toggleHold = (idx) => {
    if (rolls < 3) {
      const newHeld = [...held];
      newHeld[idx] = !newHeld[idx];
      setHeld(newHeld);
    }
  };
  // Function to roll the dice
  const rollDice = () => {
    if (rolls < 2) {
      const newDices = dices.map((dice, idx) =>
        held[idx] ? dice : 1 + Math.floor(Math.random() * 6)
      );
      setDices(newDices);
      setRolls(rolls + 1);
    }
  };

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    if (availableCategories.includes(category)) {
      const newScores = { ...scores };
      let categoryScore;
      
      // Handling scoring for upper section
      if (
        category === 'Ones' ||
        category === 'Twos' ||
        category === 'Threes' ||
        category === 'Fours' ||
        category === 'Fives' ||
        category === 'Sixes'
      ) {
        categoryScore = calculateUpperSectionScore(category, dices);
        newScores.upper[category] = categoryScore;
        newScores.upper.Total = calculateUpperSectionTotal(newScores.upper);
        newScores.upper.Bonus = calculateUpperSectionBonus(newScores.upper);
      } else {
        // Handling scoring for lower section
        categoryScore = calculateLowerSectionScore(category, dices);
        newScores.lower[category] = categoryScore;
        newScores.lower.TotalLower = calculateLowerSectionTotal(newScores.lower);
        newScores.lower.GrandTotal = calculateGrandTotal(
          newScores.lower,
          newScores.upper
        );
      }
      // Updating scores state
      setScores(newScores);
      // Resetting dice rolls and values for next turn
      setRolls(0);
      setDices(getRandomDiceValues());
      setHeld([false, false, false, false, false]);
    }
  };

  // Function to calculate the score of a specific upper section category based on the dice rolls
const calculateUpperSectionScore = (category, dices) => {
  // Define the value of each category in the upper section
  const categoryValues = {
    Ones: 1,
    Twos: 2,
    Threes: 3,
    Fours: 4,
    Fives: 5,
    Sixes: 6,
  };

  // Retrieve the value associated with the provided category
  const value = categoryValues[category];
  // If the category is not valid, return a score of 0
  if (value === undefined) return 0;

  // Calculate the score for the category by summing the values of the dice that match the category
  return dices.reduce(
    (acc, dice) => (dice === value ? acc + value : acc),
    0
  );
};

// Function to calculate the total score of the upper section
const calculateUpperSectionTotal = (upperScores) => {
  // List of categories in the upper section
  const categories = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
  // Calculate the total score by summing the scores of all categories
  return categories.reduce(
    (acc, category) => (upperScores[category] || 0) + acc,
    0
  );
};

// Function to calculate the upper section bonus
const calculateUpperSectionBonus = (upperScores) => {
  // Calculate the total score of the upper section
  const upperTotal = calculateUpperSectionTotal(upperScores);
  // If the total score is 63 or more, the player receives a bonus of 35 points
  return upperTotal >= 63 ? 35 : 0;
};

// Function to calculate the score of a specific lower section category based on the dice rolls
const calculateLowerSectionScore = (category, dices) => {
  // Sort the dice rolls in ascending order
  const sortedDices = [...dices].sort();
  // Count the occurrence of each dice value
  const diceCount = sortedDices.reduce((acc, dice) => {
    acc[dice] = (acc[dice] || 0) + 1;
    return acc;
  }, {});

  // Calculate the score based on the lower section category
  switch (category) {
    case 'ThreeOfAKind':
      // Check if there are three or more of the same dice, if true, return the sum of all dice
      return Object.values(diceCount).some((count) => count >= 3)
        ? sortedDices.reduce((a, b) => a + b, 0)
        : 0;
    case 'FourOfAKind':
      // Check if there are four or more of the same dice, if true, return the sum of all dice
      return Object.values(diceCount).some((count) => count >= 4)
        ? sortedDices.reduce((a, b) => a + b, 0)
        : 0;
    case 'FullHouse':
      // Check for a Full House (3 of a kind and a pair), if true, return 25 points
      return new Set(sortedDices).size === 2 &&
        Object.values(diceCount).includes(3)
        ? 25
        : 0;
    case 'SmallStraight':
      // Check for a Small Straight (4 consecutive numbers), if true, return 30 points
      const smallStraight1 = [1, 2, 3, 4];
      const smallStraight2 = [2, 3, 4, 5];
      const smallStraight3 = [3, 4, 5, 6];
      const isSmallStraight = [smallStraight1, smallStraight2, smallStraight3].some(
        (straight) =>
          straight.every((num) => sortedDices.includes(num))
      );
      return isSmallStraight ? 30 : 0;
    case 'LargeStraight':
      // Check for a Large Straight (5 consecutive numbers), if true, return 40 points
      const largeStraight1 = [1, 2, 3, 4, 5];
      const largeStraight2 = [2, 3, 4, 5, 6];
      const isLargeStraight = [largeStraight1, largeStraight2].some(
        (straight) =>
          straight.every((num) => sortedDices.includes(num))
      );
      return isLargeStraight ? 40 : 0;
    case 'Yahtzee':
      // Check for a Yahtzee (5 of a kind), if true, return 50 points
      return new Set(sortedDices).size === 1 ? 50 : 0;
    case 'Chance':
      // Return the sum of all dice
      return sortedDices.reduce((a, b) => a + b, 0);
    default:
      // If the category is not valid, return a score of 0
      return 0;
  }
};

// Function to calculate the total score of the lower section
const calculateLowerSectionTotal = (lowerScores) => {
  // List of categories in the lower section
  const categories = [
    'ThreeOfAKind',
    'FourOfAKind',
    'FullHouse',
    'SmallStraight',
    'LargeStraight',
    'Yahtzee',
    'Chance',
  ];
  // Calculate the total score by summing the scores of all categories
  return categories.reduce(
    (acc, category) => (lowerScores[category] || 0) + acc,
    0
  );
};

// Function to calculate the grand total score (upper + lower sections)
const calculateGrandTotal = (lowerScores, upperScores) => {
  // Calculate the total scores of both sections
  const lowerTotal = calculateLowerSectionTotal(lowerScores);
  const upperTotal = calculateUpperSectionTotal(upperScores);
  // Return the sum of both totals
  return lowerTotal + upperTotal;
};

// Function to calculate the available categories based on the current scores
const calculateAvailableCategories = (scores) => {
  const availableCategories = [];

  // Add upper section categories that have not been scored yet
  for (const category of Object.keys(scores.upper)) {
    if (scores.upper[category] === null) {
      availableCategories.push(category);
    }
  }

  // Add lower section categories that have not been scored yet
  for (const category of Object.keys(scores.lower)) {
    if (scores.lower[category] === null) {
      availableCategories.push(category);
    }
  }

  // Return the list of available categories
  return availableCategories;
};

// Function to update the total scores
const updateTotals = () => {
  // Calculate the total, bonus, and grand total scores
  const upperTotal = calculateUpperSectionTotal(scores.upper);
  const upperBonus = calculateUpperSectionBonus(scores.upper);
  const lowerTotal = calculateLowerSectionTotal(scores.lower);
  const grandTotal = calculateGrandTotal(scores.lower, scores.upper);

  // Update the state with the new total scores
  setScores((prevScores) => ({
    upper: {
      ...prevScores.upper,
      Total: upperTotal,
      Bonus: upperBonus,
    },
    lower: {
      ...prevScores.lower,
      TotalLower: lowerTotal,
      GrandTotal: grandTotal,
    },
  }));
};


  const isUpperSectionFullyScored = Object.values(scores.upper).every(
    (score) => score !== null
  );
  // Main render
  return (
    <div className="App">
      <Navbar finalScore={gameOver ? finalScores.reduce((a, b) => a + b, 0) : null} />
      <div className="main-content">
        <Scoreboard
          scores={scores}
          availableCategories={availableCategories}
          onSelectCategory={handleCategorySelect}
          dices={dices}
          calculateUpperSectionScore={calculateUpperSectionScore}
          calculateLowerSectionScore={calculateLowerSectionScore}
        />
        <Gameboard
          dices={dices}
          held={held}
          onToggleHold={toggleHold}
          onRollDice={rollDice}
          rolls={rolls}
          isNewGame={isNewGame} // Pass isNewGame as a prop to Gameboard
        />
        {gameOver && <GameOverBanner finalScore={finalScores.reduce((a, b) => a + b, 0)} />}
      </div>
    </div>
  );
}

export default App;

