import React, { useEffect } from 'react';
import dice1 from './Assets/dice-six-faces-one.png';
import dice2 from './Assets/dice-six-faces-two.png';
import dice3 from './Assets/dice-six-faces-three.png';
import dice4 from './Assets/dice-six-faces-four.png';
import dice5 from './Assets/dice-six-faces-five.png';
import dice6 from './Assets/dice-six-faces-six.png';
import boardBackground from './Assets/Background logo high res black.png';

function Gameboard({ dices, held, onToggleHold, onRollDice }) {
  // Array to store the images of each dice face
  const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

  // Function to generate a random rotation angle for the dice
  const getRandomRotation = () => {
    return Math.floor(Math.random() * 360);
  };

  // Array to define potential positions of dice on the game board
  const grid = [
    { x: 0, y: 0 }, { x: 33.33, y: 0 }, { x: 66.66, y: 0 }, 
    { x: 0, y: 50 }, { x: 33.33, y: 50 }, { x: 66.66, y: 50 }
  ];
  
  // Array to track which sections of the grid are currently occupied by dice
  let occupiedSections = [];
  
  // Function to assign a unique section of the grid to a dice
  const getSectionForDice = () => {
    let section;
    while (!section) {
      const randomIndex = Math.floor(Math.random() * grid.length);
      if (!occupiedSections.includes(randomIndex)) {
        occupiedSections.push(randomIndex);
        section = grid[randomIndex];
      }
    }
    return section;
  };

  // Effect to reset occupied sections when dice are re-rolled
  useEffect(() => {
    occupiedSections = [];
  }, [dices]);

  // Render method to display the game board, dice, and roll button
  return (
    <div className="gameboard" style={{ backgroundImage: `url(${boardBackground})` }}>
      <div className="dice-container">
        {dices.map((diceValue, idx) => {
          const position = getSectionForDice();
          position.x += Math.floor(Math.random() * 0) - 5;
          position.y += Math.floor(Math.random() * -30) - 5;
          const rotation = getRandomRotation();

          return (
            <div
              key={idx}
              className={`dice dice${diceValue} ${held[idx] ? 'held' : ''}`}
              onClick={() => onToggleHold(idx)}
              style={{
                transform: `translate(${position.x}%, ${position.y}%) rotate(${rotation}deg)`,
                cursor: 'pointer'
              }}
            >
              <img src={diceImages[diceValue - 1]} alt={`Dice showing ${diceValue}`} />
            </div>
          );
        })}
      </div>
      <button className="roll-button" onClick={onRollDice}>
        Roll Dice
      </button>
    </div>
  );
}

export default Gameboard;
