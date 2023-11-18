import React, { useState, useEffect } from 'react';
import dice1 from './Assets/dice-six-faces-one.png';
import dice2 from './Assets/dice-six-faces-two.png';
import dice3 from './Assets/dice-six-faces-three.png';
import dice4 from './Assets/dice-six-faces-four.png';
import dice5 from './Assets/dice-six-faces-five.png';
import dice6 from './Assets/dice-six-faces-six.png';
import boardBackground from './Assets/Background logo high res black.png';
import _ from 'lodash';


// Functional component to represent a single dice
function Dice({ value, isHeld, toggleHold, diceImages, position, rotation }) {
  // Render a dice with dynamic styles based on its state and props
  return (
    <div
      className={`dice dice${value} ${isHeld ? 'held' : ''}`}
      onClick={toggleHold} // Toggle hold state of dice when clicked
      style={{
        transform: `translate(${position.x}%, ${position.y}%) rotate(${rotation}deg)`, // Apply translation and rotation
        cursor: 'pointer', // Change cursor to pointer to indicate clickability
        position: 'absolute', // Position absolutely within its parent
      }}
    >
      <img src={diceImages[value - 1]} alt={`Dice showing ${value}`} /*Display the image of the current dice face*/ />
    </div>
  );
}
function GameOverBanner({ finalScore }) {
  return (
    <div className="game-over-banner">
      <h1>Congratulations!</h1>
      <p>Your final score is: {finalScore}</p>
    </div>
  );
}

// Functional component to represent the game board
function Gameboard({ dices, held, onToggleHold, onRollDice, rolls }) {
  // Array of dice face images
  const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

  // Predefined set of non-overlapping positions
  const predefinedPositions = [
    { x: 10, y: 12 }, { x: 126, y: 11 }, { x: 251, y: 8 }, { x: 371, y: 8 },
    { x: 14, y: 235 }, { x: 130, y: 235 }, { x: 253, y: 235 }, { x: 370, y: 235 },
    { x: 9, y: 460 }, { x: 129, y: 460 }, { x: 240, y: 460 }, { x: 372, y: 460 }
    
  ];

  // Shuffle and slice the predefined positions to get random positions for each dice
  function getRandomPositions() {
    return _.shuffle(predefinedPositions).slice(0, dices.length);
  }

  // State to manage positions of dice on the board
  const [positions, setPositions] = useState(getRandomPositions());

  // State to manage rotations of dice on the board
  const [rotations, setRotations] = useState(Array(dices.length).fill(0));

  // Effect to update positions and rotations of dice only when they are rolled
  useEffect(() => {
    if (rolls > 0) {
      setPositions(getRandomPositions());
      setRotations(rotations.map((rotation, idx) => (!held[idx] ? Math.floor(Math.random() * 360) : rotation)));
    }
  }, [rolls]);

  // Render the game board with dice and a roll button
  return (
    <div id="yahtzeeLogo" className="gameboard" style={{ backgroundImage: `url(${boardBackground})`, position: 'relative' }}>
      <div className="dice-container">
        {dices.map((diceValue, idx) => (
          <Dice
            key={idx}
            value={diceValue}
            isHeld={held[idx]}
            toggleHold={() => onToggleHold(idx)}
            diceImages={diceImages}
            position={positions[idx]}
            rotation={rotations[idx]}
          />
        ))}
      </div>
      <button className="roll-button" onClick={onRollDice}>
        Roll Dice
      </button>
    </div>
  );
}

export default Gameboard;
