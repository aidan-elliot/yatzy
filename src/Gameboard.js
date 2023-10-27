import React, { useState, useEffect } from 'react';
import dice1 from './Assets/dice-six-faces-one.png';
import dice2 from './Assets/dice-six-faces-two.png';
import dice3 from './Assets/dice-six-faces-three.png';
import dice4 from './Assets/dice-six-faces-four.png';
import dice5 from './Assets/dice-six-faces-five.png';
import dice6 from './Assets/dice-six-faces-six.png';
import boardBackground from './Assets/Background logo high res black.png';

function Dice({ value, isHeld, toggleHold, diceImages, position, rotation }) {
    return (
        <div
            className={`dice dice${value} ${isHeld ? 'held' : ''}`}
            onClick={toggleHold}
            style={{
                transform: `translate(${position.x}%, ${position.y}%) rotate(${rotation}deg)`,
                cursor: 'pointer',
                position: 'absolute',
            }}
        >
            <img src={diceImages[value - 1]} alt={`Dice showing ${value}`} />
        </div>
    );
}

function Gameboard({ dices, held, onToggleHold, onRollDice }) {
  const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];
  const [positions, setPositions] = useState(Array(dices.length).fill().map(() => ({ x: 0, y: 0 })));
  const [rotations, setRotations] = useState(Array(dices.length).fill(0));

    useEffect(() => {
      setRotations(rotations.map((rotation, idx) => (!held[idx] ? Math.floor(Math.random() * 360) : rotation)));
      setPositions(positions.map((position, idx) => (!held[idx] ? getRandomPosition(positions) : position)));
  }, [dices]);

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

    function isOverlapping(position, existingPositions) {
        return existingPositions.some(existing =>
            Math.abs(existing.x - position.x) < 15 &&
            Math.abs(existing.y - position.y) < 15
        );
    }

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
