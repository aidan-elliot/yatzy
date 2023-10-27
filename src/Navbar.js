import React from 'react';
import Logo from './Assets/Logo white.png';

function Navbar({ finalScore }) {
  const renderButtons = () => {
    if (finalScore !== null) {
      // Display the final score when the game is over
      return <button className="navbar-btn">{finalScore}</button>;
    } else {
      // Display ten buttons for scoring during gameplay
      const buttons = [];
      for (let i = 1; i <= 10; i++) {
        buttons.push(
          <button key={`Button-${i}`} className="navbar-btn">
           
          </button>
        );
      }
      return buttons;
    }
  };

  return (
    <div className="navbar">
      {/* Logo at the top */}
      <img src={Logo} alt="Logo" className="navbar-logo" />
      {/* Buttons */}
      {renderButtons()}
    </div>
  );
}

export default Navbar;
