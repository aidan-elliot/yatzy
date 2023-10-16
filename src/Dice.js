import React from 'react';
import dice1 from './Assets/dice-six-faces-one.svg';
import dice2 from './Assets/dice-six-faces-two.svg';
import dice3 from './Assets/dice-six-faces-three.svg';
import dice4 from './Assets/dice-six-faces-four.svg';
import dice5 from './Assets/dice-six-faces-five.svg';
import dice6 from './Assets/dice-six-faces-six.svg';

const Dice = ({ value, onClick, held }) => {
  const diceImages = {
    1: dice1,
    2: dice2,
    3: dice3,
    4: dice4,
    5: dice5,
    6: dice6,
  };

  const diceClass = held ? "dice held" : "dice";

  return (
    <img className={diceClass} src={diceImages[value]} alt={`Dice with ${value} faces`} onClick={onClick} />
  );
};

export default Dice;