import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import './App.css';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';

function App() {
  const [dices, setDices] = useState([1, 1, 1, 1, 1]);
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
      TotalUpper: null,
      GrandTotal: null,
    },
  });

  // State to store available categories
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const availableCategories = calculateAvailableCategories(scores);
    setAvailableCategories(availableCategories);
  }, [scores]);

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
      
      if (category === 'Ones' || category === 'Twos' || category === 'Threes' || category === 'Fours' || category === 'Fives' || category === 'Sixes') {
        // Calculate upper section scores
        categoryScore = calculateUpperSectionScore(category, dices);
        newScores.upper[category] = categoryScore;
        newScores.upper.Total = calculateUpperSectionTotal(newScores.upper);
        newScores.upper.Bonus = calculateUpperSectionBonus(newScores.upper);
      } else {
        // Calculate lower section scores
        categoryScore = calculateLowerSectionScore(category, dices);
        newScores.lower[category] = categoryScore;
        newScores.lower.TotalLower = calculateLowerSectionTotal(newScores.lower);
        newScores.lower.TotalUpper = newScores.upper.Total || 0;
        newScores.lower.GrandTotal = calculateGrandTotal(newScores.lower, newScores.upper);
      }
  
      setScores(newScores);
  
      // Reset rolls, dices, and held for the next turn
      setRolls(0);
      setDices([1, 1, 1, 1, 1]);
      setHeld([false, false, false, false, false]);
    }
  };
  
  // Calculate scores for upper section (Ones, Twos, Threes, Fours, Fives, Sixes)
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
    if (value === undefined) return 0; // Or handle this case as needed
  
    return dices.reduce((acc, dice) => (dice === value ? acc + value : acc), 0);
  };

  // Calculate total score for upper section
  const calculateUpperSectionTotal = (upperScores) => {
    return Object.values(upperScores).reduce((acc, score) => (score || 0) + acc, 0);
  };

  // Calculate bonus for upper section
  const calculateUpperSectionBonus = (upperScores) => {
    const upperTotal = calculateUpperSectionTotal(upperScores);
    return upperTotal >= 63 ? 35 : 0;
  };

  // Implement your scoring logic for lower section categories here
  const calculateLowerSectionScore = (category, dices) => {
    const sortedDices = [...dices].sort();
    const diceCount = sortedDices.reduce((acc, dice) => {
      acc[dice] = (acc[dice] || 0) + 1;
      return acc;
    }, {});
  
    switch (category) {
      case 'ThreeOfAKind':
        return Object.values(diceCount).some(count => count >= 3) ? sortedDices.reduce((a, b) => a + b, 0) : 0;
      case 'FourOfAKind':
        return Object.values(diceCount).some(count => count >= 4) ? sortedDices.reduce((a, b) => a + b, 0) : 0;
      case 'FullHouse':
        return (new Set(sortedDices)).size === 2 && Object.values(diceCount).includes(3) ? 25 : 0;
      case 'SmallStraight':
        const smallStraight1 = [1, 2, 3, 4];
        const smallStraight2 = [2, 3, 4, 5];
        const smallStraight3 = [3, 4, 5, 6];
        const isSmallStraight = [smallStraight1, smallStraight2, smallStraight3].some(straight =>
          straight.every(num => sortedDices.includes(num))
        );
        return isSmallStraight ? 30 : 0;
      case 'LargeStraight':
        const largeStraight1 = [1, 2, 3, 4, 5];
        const largeStraight2 = [2, 3, 4, 5, 6];
        const isLargeStraight = [largeStraight1, largeStraight2].some(straight =>
          straight.every(num => sortedDices.includes(num))
        );
        return isLargeStraight ? 40 : 0;
      case 'Yahtzee':
        return (new Set(sortedDices)).size === 1 ? 50 : 0;
      case 'Chance':
        return sortedDices.reduce((a, b) => a + b, 0);
      default:
        return 0;
    }
  };
  

  // Calculate total score for lower section
  const calculateLowerSectionTotal = (lowerScores) => {
    return Object.values(lowerScores).reduce((acc, score) => (score || 0) + acc, 0);
  };

  // Calculate grand total score
  const calculateGrandTotal = (lowerScores, upperScores) => {
    const lowerTotal = calculateLowerSectionTotal(lowerScores);
    const upperTotal = upperScores.Total || 0;
    return lowerTotal + upperTotal + (upperScores.Bonus || 0);
  };

  // Define your function to calculate available categories here
  const calculateAvailableCategories = (scores) => {
    const availableCategories = [];
  
    // Check upper section
    for (const category of Object.keys(scores.upper)) {
      if (scores.upper[category] === null) {
        availableCategories.push(category);
      }
    }
  
    // Check lower section
    for (const category of Object.keys(scores.lower)) {
      if (scores.lower[category] === null) {
        availableCategories.push(category);
      }
    }
  
    return availableCategories;
  };

  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Scoreboard
          scores={scores}
          availableCategories={availableCategories}
          onSelectCategory={handleCategorySelect}
        />
        <Gameboard
          dices={dices}
          held={held}
          onToggleHold={toggleHold}
          onRollDice={rollDice}
          rolls={rolls}
        />
      </div>
    </div>
  );
}

export default App;
