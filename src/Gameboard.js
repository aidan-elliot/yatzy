import React, { useEffect } from 'react';
import dice1 from './Assets/dice-six-faces-one.png';
import dice2 from './Assets/dice-six-faces-two.png';
import dice3 from './Assets/dice-six-faces-three.png';
import dice4 from './Assets/dice-six-faces-four.png';
import dice5 from './Assets/dice-six-faces-five.png';
import dice6 from './Assets/dice-six-faces-six.png';
import boardBackground from './Assets/Background logo high res black.png';


function Gameboard({ dices, held, onToggleHold, onRollDice }) {
    const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

    const getRandomRotation = () => {
        return Math.floor(Math.random() * 360);
    };
    const grid = [
        { x: 0, y: 0 }, { x: 33.33, y: 0 }, { x: 66.66, y: 0 }, 
        { x: 0, y: 50 }, { x: 33.33, y: 50 }, { x: 66.66, y: 50 }
    ];
    
    let occupiedSections = [];
    
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

    useEffect(() => {
        occupiedSections = [];
    }, [dices]);
    

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
