import React, { useState } from 'react';
import Scoreboard from './Scoreboard';
import Controls from './Controls';
import './App.css';
import Dice from './Dice';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';


function App() {
  const [dices, setDices] = useState([1, 1, 1, 1, 1]);
  const [held, setHeld] = useState([false, false, false, false, false]);
  const [scores, setScores] = useState({
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
      TotalUpper: null,
      GrandTotal: null
    }
  });
  const toggleHold = (idx) => {
    const newHeld = [...held];
    newHeld[idx] = !newHeld[idx];
    setHeld(newHeld);
  };

  const rollDice = () => {
    const newDices = dices.map((dice, idx) => 
      held[idx] ? dice : 1 + Math.floor(Math.random() * 6)
    );
    setDices(newDices);
  };
  const calculateScores = (dices) => {
    const diceCounts = Array(6).fill(0);
    dices.forEach(dice => {
      diceCounts[dice - 1]++;
    });
  
    const sumDices = dices.reduce((acc, curr) => acc + curr, 0);

    const isSmallStraight = (diceCounts) => {
      return (
        (diceCounts[0] && diceCounts[1] && diceCounts[2] && diceCounts[3]) ||
        (diceCounts[1] && diceCounts[2] && diceCounts[3] && diceCounts[4]) ||
        (diceCounts[2] && diceCounts[3] && diceCounts[4] && diceCounts[5])
      );
    };
  
    const isLargeStraight = (diceCounts) => {
      return (
        (diceCounts[0] && diceCounts[1] && diceCounts[2] && diceCounts[3] && diceCounts[4]) ||
        (diceCounts[1] && diceCounts[2] && diceCounts[3] && diceCounts[4] && diceCounts[5])
      );
    };
    
    return {
      Ones: diceCounts[0] * 1,
      Twos: diceCounts[1] * 2,
      Threes: diceCounts[2] * 3,
      Fours: diceCounts[3] * 4,
      Fives: diceCounts[4] * 5,
      Sixes: diceCounts[5] * 6,
      ThreeOfAKind: diceCounts.some(count => count >= 3) ? sumDices : 0,
      FourOfAKind: diceCounts.some(count => count >= 4) ? sumDices : 0,
      FullHouse: diceCounts.includes(2) && diceCounts.includes(3) ? 25 : 0,
      SmallStraight: isSmallStraight(diceCounts) ? 30 : 0,
      LargeStraight: isLargeStraight(diceCounts) ? 40 : 0
      // Continue for other scores...
    };
  };

  return (
    <div className="App">
        <Navbar />
        <div className="main-content">
            <Scoreboard scores={scores} />
            <Gameboard 
                dices={dices} 
                held={held} 
                onToggleHold={toggleHold} 
                onRollDice={rollDice} 
            />
        </div>
    </div>
    );
  }
    
  

export default App;
