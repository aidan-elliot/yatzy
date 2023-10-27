import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import './App.css';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';

function App() {
  const getRandomDiceValues = () => {
    return Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6));
  };

  const [dices, setDices] = useState(getRandomDiceValues());
  const [held, setHeld] = useState([false, false, false, false, false]);
  const [rolls, setRolls] = useState(0);
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

  const [availableCategories, setAvailableCategories] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState([]);
  const [isNewGame, setIsNewGame] = useState(false);

  useEffect(() => {
    const availableCategories = calculateAvailableCategories(scores);
    setAvailableCategories(availableCategories);
  }, [scores]);

  useEffect(() => {
    updateTotals(); // Automatically update totals whenever scores change
  }, [scores]);

  useEffect(() => {
    // Check if the game is over (e.g., when all categories are scored)
    const isGameOver = availableCategories.length === 0;
    setGameOver(isGameOver);

    // Calculate and store the final scores when the game is over
    if (isGameOver) {
      const finalScoresArray = Object.values(scores.upper)
        .concat(Object.values(scores.lower))
        .filter((score) => score !== null);
      setFinalScores(finalScoresArray);
      setIsNewGame(true); // Set to true when the game ends
    } else {
      setIsNewGame(false); // Reset to false when the game continues
    }
  }, [availableCategories, scores]);

  const toggleHold = (idx) => {
    if (rolls < 3) {
      const newHeld = [...held];
      newHeld[idx] = !newHeld[idx];
      setHeld(newHeld);
    }
  };

  const rollDice = () => {
    if (rolls < 3) {
      const newDices = dices.map((dice, idx) =>
        held[idx] ? dice : 1 + Math.floor(Math.random() * 6)
      );
      setDices(newDices);
      setRolls(rolls + 1);
    }
  };

  const handleCategorySelect = (category) => {
    if (availableCategories.includes(category)) {
      const newScores = { ...scores };
      let categoryScore;

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
        categoryScore = calculateLowerSectionScore(category, dices);
        newScores.lower[category] = categoryScore;
        newScores.lower.TotalLower = calculateLowerSectionTotal(newScores.lower);
        newScores.lower.GrandTotal = calculateGrandTotal(
          newScores.lower,
          newScores.upper
        );
      }

      setScores(newScores);

      setRolls(0);
      setDices(getRandomDiceValues());
      setHeld([false, false, false, false, false]);
    }
  };

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
    if (value === undefined) return 0;

    return dices.reduce(
      (acc, dice) => (dice === value ? acc + value : acc),
      0
    );
  };

  const calculateUpperSectionTotal = (upperScores) => {
    const categories = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
    return categories.reduce(
      (acc, category) => (upperScores[category] || 0) + acc,
      0
    );
  };

  const calculateUpperSectionBonus = (upperScores) => {
    const upperTotal = calculateUpperSectionTotal(upperScores);
    return upperTotal >= 63 ? 35 : 0;
  };

  const calculateLowerSectionScore = (category, dices) => {
    const sortedDices = [...dices].sort();
    const diceCount = sortedDices.reduce((acc, dice) => {
      acc[dice] = (acc[dice] || 0) + 1;
      return acc;
    }, {});

    switch (category) {
      case 'ThreeOfAKind':
        return Object.values(diceCount).some((count) => count >= 3)
          ? sortedDices.reduce((a, b) => a + b, 0)
          : 0;
      case 'FourOfAKind':
        return Object.values(diceCount).some((count) => count >= 4)
          ? sortedDices.reduce((a, b) => a + b, 0)
          : 0;
      case 'FullHouse':
        return new Set(sortedDices).size === 2 &&
          Object.values(diceCount).includes(3)
          ? 25
          : 0;
      case 'SmallStraight':
        const smallStraight1 = [1, 2, 3, 4];
        const smallStraight2 = [2, 3, 4, 5];
        const smallStraight3 = [3, 4, 5, 6];
        const isSmallStraight = [smallStraight1, smallStraight2, smallStraight3].some(
          (straight) =>
            straight.every((num) => sortedDices.includes(num))
        );
        return isSmallStraight ? 30 : 0;
      case 'LargeStraight':
        const largeStraight1 = [1, 2, 3, 4, 5];
        const largeStraight2 = [2, 3, 4, 5, 6];
        const isLargeStraight = [largeStraight1, largeStraight2].some(
          (straight) =>
            straight.every((num) => sortedDices.includes(num))
        );
        return isLargeStraight ? 40 : 0;
      case 'Yahtzee':
        return new Set(sortedDices).size === 1 ? 50 : 0;
      case 'Chance':
        return sortedDices.reduce((a, b) => a + b, 0);
      default:
        return 0;
    }
  };

  const calculateLowerSectionTotal = (lowerScores) => {
    const categories = [
      'ThreeOfAKind',
      'FourOfAKind',
      'FullHouse',
      'SmallStraight',
      'LargeStraight',
      'Yahtzee',
      'Chance',
    ];
    return categories.reduce(
      (acc, category) => (lowerScores[category] || 0) + acc,
      0
    );
  };

  const calculateGrandTotal = (lowerScores, upperScores) => {
    const lowerTotal = calculateLowerSectionTotal(lowerScores);
    const upperTotal = calculateUpperSectionTotal(upperScores);
    return lowerTotal + upperTotal;
  };

  const calculateAvailableCategories = (scores) => {
    const availableCategories = [];

    for (const category of Object.keys(scores.upper)) {
      if (scores.upper[category] === null) {
        availableCategories.push(category);
      }
    }

    for (const category of Object.keys(scores.lower)) {
      if (scores.lower[category] === null) {
        availableCategories.push(category);
      }
    }

    return availableCategories;
  };

  const updateTotals = () => {
    const upperTotal = calculateUpperSectionTotal(scores.upper);
    const upperBonus = calculateUpperSectionBonus(scores.upper);
    const lowerTotal = calculateLowerSectionTotal(scores.lower);
    const grandTotal = calculateGrandTotal(scores.lower, scores.upper);

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
      </div>
    </div>
  );
}

export default App;

