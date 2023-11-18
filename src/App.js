import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import './App.css';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';
import GameOverBanner from './GameOverBanner';
import _ from 'lodash';

function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchGameState = async () => {
    try {
      const response = await fetch('http://localhost:3001/game-state');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGameState(data);
      setIsLoading(false); // End loading only after the initial fetch
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching game state:', error.message);
      setFetchError(error.message);
      setIsLoading(false); // Ensure loading is ended even in case of error
    }
  };

  // Fetch game state on component mount only
  useEffect(() => {
    fetchGameState();
  }, []);

  // Function to toggle holding a die
  const toggleHold = (idx) => {
    if (gameState && gameState.rolls < 2) {
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
    if (gameState && gameState.rolls < 2) {
      fetch('http://localhost:3001/roll-dice')
        .then(response => response.json())
        .then(data => setGameState(data)) // Update the entire gameState with the server response
        .catch(error => console.error('Error rolling dice:', error));
    }
  };

// Function to handle category selection and score update
const handleCategorySelect = async (category) => {
  if (gameState) {
    try {
      console.log("Sending category for calculation:", category); // Log the category being sent
      const response = await fetch('http://localhost:3001/calculate-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, dices: gameState.dices }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      rollDice();
      if (!data.gameState) {
        throw new Error('Invalid response from server');
      }

      console.log("Received new game state:", data.gameState); // Log the response
      setGameState(_.cloneDeep(data.gameState)); // Deep clone the game state before setting it
    } catch (error) {
      console.error('Error calculating score:', error.message);
      // Optionally, display this error on the UI
    }
  }
};




  if (isLoading) {
    return <div>Loading...</div>; // Loading screen only active during initial fetch
  }
  if (fetchError) {
    return <div>Error loading game: {fetchError}</div>; // Show error message
  }

  return (
    <div className="App">
      <Navbar finalScore={gameState.gameOver ? gameState.finalScores : null} />
      <div className="main-content">
        <Scoreboard
          scores={gameState.scores}
          availableCategories={gameState.availableCategories}
          onSelectCategory={handleCategorySelect} // Directly pass handleCategorySelect
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
