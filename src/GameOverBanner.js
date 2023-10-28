import React from 'react';

function GameOverBanner({ finalScore }) {
  return (
    <div className="game-over-banner">
      <h1>Congratulations!</h1>
      <p>Your final score is: {finalScore}</p>
    </div>
  );
}

export default GameOverBanner;
