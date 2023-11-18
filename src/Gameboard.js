import React, { useState, useEffect } from 'react';
import dice1 from './Assets/dice-six-faces-one.png';
import dice2 from './Assets/dice-six-faces-two.png';
import dice3 from './Assets/dice-six-faces-three.png';
import dice4 from './Assets/dice-six-faces-four.png';
import dice5 from './Assets/dice-six-faces-five.png';
import dice6 from './Assets/dice-six-faces-six.png';
import boardBackground from './Assets/Background logo high res black.png';

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
  // State to manage positions of dice on the board
  const [positions, setPositions] = useState(Array(dices.length).fill().map(() => ({ x: 0, y: 0 })));
  // State to manage rotations of dice on the board
  const [rotations, setRotations] = useState(Array(dices.length).fill(0));

  // Effect to update positions and rotations of dice only when they are rolled
  useEffect(() => {
    if (rolls > 0) {
      setRotations(rotations.map((rotation, idx) => (!held[idx] ? Math.floor(Math.random() * 360) : rotation)));
      setPositions(positions.map((position, idx) => (!held[idx] ? getRandomPosition(positions) : position)));
    }
  }, [dices, rolls, held]);

  // Function to generate a random position for a dice
  function getRandomPosition(existingPositions) {
    let newPosition;
    let tries = 0;

    do {
      newPosition = {
        x: Math.random() * 400,
        y: Math.random() * 460
      };

      tries++;

      if (tries > 50) {
        break;
      }
    } while (isOverlapping(newPosition, existingPositions))

    return newPosition;
  }

  // Function to check if a position overlaps with existing positions
  function isOverlapping(position, existingPositions) {
    return existingPositions.some(existing =>
      Math.abs(existing.x - position.x) < 15 &&
      Math.abs(existing.y - position.y) < 15
    );
  }

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
// Exporting Gameboard component as the default export of the module
export default Gameboard;