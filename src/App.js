import React, { useState, useEffect} from 'react';
import Scoreboard from './Scoreboard';
import './App.css';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';
import GameOverBanner from './GameOverBanner';

function App() {
  const [gameState, setGameState] = useState(null);

  const fetchGameState = async () => {
    try {
      const response = await fetch('http://localhost:3001/game-state');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error('Error fetching game state:', error.message);
    }
  };

  // Use effect to fetch game state on component mount
  useEffect(() => {
    fetchGameState();
  }, []);

  // Function to toggle holding a die
  const toggleHold = (idx) => {
    if (gameState && gameState.rolls < 3) {
      const newHeld = [...gameState.held];
      newHeld[idx] = !newHeld[idx];
      fetch('http://localhost:3001/update-held', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ held: newHeld }),
      })
        .then(response => response.json())
        .then(data => setGameState(data.gameState)) // Update the entire gameState
        .catch(error => console.error('Error updating hold:', error));
    }
  };

  // Function to roll the dice
  const rollDice = () => {
    if (gameState && gameState.rolls < 3) {
      fetch('http://localhost:3001/roll-dice')
        .then(response => response.json())
        .then(data => setGameState(data)) // Update the entire gameState with the server response
        .catch(error => console.error('Error rolling dice:', error));
    }
  };

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    if (gameState) {
      fetch('http://localhost:3001/calculate-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, dices: gameState.dices }),
      })
        .then(response => response.json())
        .then(data => setGameState(data.gameState)) // Update the entire gameState
        .catch(error => console.error('Error calculating score:', error));
    }
  };

  if (!gameState) {
    return <div>Loading...</div>; // Shows a loading state or a spinner
  }

  return (
    <div className="App">
      <Navbar finalScore={gameState.gameOver ? gameState.finalScores : null} />
      <div className="main-content">
        <Scoreboard
          scores={gameState.scores}
          availableCategories={gameState.availableCategories}
          onSelectCategory={handleCategorySelect}
          dices={gameState.dices}
        />
        <Gameboard
          dices={gameState.dices}
          held={gameState.held}
          onToggleHold={toggleHold}
          onRollDice={rollDice}
          rolls={gameState.rolls}
        />
        {gameState.gameOver && (
          <GameOverBanner finalScore={gameState.finalScores} />
        )}
      </div>
    </div>
  );
}

export default App;
