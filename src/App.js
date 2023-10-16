import React, { useState } from 'react';
import Scoreboard from './Scoreboard';
import Controls from './Controls';
import './App.css';
import Dice from './Dice';
import '@fontsource/inter';


function App() {
  const [dices, setDices] = useState([1, 1, 1, 1, 1]);
  const [held, setHeld] = useState([false, false, false, false, false]);
  const [scores, setScores] = useState({
    Ones: null,
    Twos: null,
    Threes: null,
    Fours: null,
    Fives: null,
    Sixes: null,
    ThreeOfAKind: null,
    FourOfAKind: null,
    FullHouse: null,
    SmallStraight: null,
    LargeStraight: null
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
      <center>
        <h1>Yatzy</h1>
        <Scoreboard scores={scores} />
        {dices.map((diceValue, idx) => (
        <Dice key={idx} value={diceValue} onClick={() => toggleHold(idx)} held={held[idx]} />
        ))}
        <Controls onRoll={rollDice} />
        </center>
        </div>
        );
      }
    
  

export default App;
