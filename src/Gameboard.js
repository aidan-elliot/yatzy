import React, { useEffect } from 'react';
import dice1 from './Assets/dice-six-faces-one.svg';
import dice2 from './Assets/dice-six-faces-two.svg';
import dice3 from './Assets/dice-six-faces-three.svg';
import dice4 from './Assets/dice-six-faces-four.svg';
import dice5 from './Assets/dice-six-faces-five.svg';
import dice6 from './Assets/dice-six-faces-six.svg';
import boardBackground from './Assets/Background logo high res black.png';


function Gameboard({ dices, held, onToggleHold, onRollDice }) {
    const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

    const getRandomRotation = () => {
        return Math.floor(Math.random() * 360); // Rotation between 0 to 360 degrees
    };
    const grid = [
        { x: 0, y: 0 }, { x: 33.33, y: 0 }, { x: 66.66, y: 0 }, 
        { x: 0, y: 50 }, { x: 33.33, y: 50 }, { x: 66.66, y: 50 }
    ];  // A 3x2 grid, expressed in percentages
    
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
                    // If you want the dice to be placed randomly within that section, adjust the x and y values a bit.
                    position.x += Math.floor(Math.random() * 10);  // Adjust the value "10" based on your design.
                    position.y += Math.floor(Math.random() * 25);  // Adjust this value too, ensuring dice stay within section bounds.                    
                    const rotation = getRandomRotation();
                    
                    return (
                    <div
                    key={idx}
                    className={`dice dice${diceValue} ${held[idx] ? 'held' : ''}`}
                    onClick={() => onToggleHold(idx)}
                    style={{
                        transform: `translate(${position.x}%, ${position.y}%) rotate(${rotation}deg)`
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
