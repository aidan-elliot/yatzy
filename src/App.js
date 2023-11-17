import React, {
  useState,
  useEffect
} from 'react';
import Scoreboard from './Scoreboard';
import './App.css';
import '@fontsource/inter';
import Navbar from './Navbar';
import Gameboard from './Gameboard';
import GameOverBanner from './GameOverBanner';

function App() {
  // State for the dice values, held dice, rolls, scores, and game status
  const [dices, setDices] = useState(Array(5).fill(1));
  const [held, setHeld] = useState(Array(5).fill(false));
  const [rolls, setRolls] = useState(0);
  const [scores, setScores] = useState({
    upper: {
      Ones: null,
      Twos: null,
      Threes: null,
      Fours: null,
      Fives: null,
      Sixes: null
    },
    lower: {
      ThreeOfAKind: null,
      FourOfAKind: null,
      FullHouse: null,
      SmallStraight: null,
      LargeStraight: null,
      Yahtzee: null,
      Chance: null
    }
  });
  const [gameState, setGameState] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isNewGame, setIsNewGame] = useState(false);
  const [finalScores, setFinalScores] = useState([]);

  const fetchGameState = async () => {
    try {
      const response = await fetch('http://localhost:3001/game-state');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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

  useEffect(() => {
    // Fetch available categories
    fetch('http://localhost:3001/available-categories')
      .then(response => response.json())
      .then(data => {
        setAvailableCategories(data.availableCategories);
      })
      .catch(error => console.error('Error fetching available categories:', error));

    // Fetch final scores
    fetch('http://localhost:3001/final-scores')
      .then(response => response.json())
      .then(data => {
        setFinalScores(data.finalScores);
      })
      .catch(error => console.error('Error fetching final scores:', error));
  }, [scores]);


  // Fetch game state from server
  useEffect(() => {
    fetch('http://localhost:3001/game-state')
      .then(response => response.json())
      .then(data => {
        setDices(data.dices);
        setHeld(data.held);
        setRolls(data.rolls);
        setScores(data.scores);
        setGameOver(data.gameOver);
      })
      .catch(error => console.error('Error fetching game state:', error));
  }, []);

  // Function to toggle holding a die
  const toggleHold = (idx) => {
    if (rolls < 3) {
      const newHeld = [...held];
      newHeld[idx] = !newHeld[idx];
      fetch('http://localhost:3001/update-held', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            held: newHeld
          }),
        })
        .then(response => response.json())
        .then(data => setHeld(data.gameState.held))
        .catch(error => console.error('Error updating hold:', error));
    }
  };

  // Function to roll the dice
  const rollDice = () => {
    if (rolls < 2) {
      fetch('http://localhost:3001/roll-dice')
        .then(response => response.json())
        .then(data => {
          setDices(data.dices);
          setRolls(data.rolls);
        })
        .catch(error => console.error('Error rolling dice:', error));
    }
  };

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    fetch('http://localhost:3001/calculate-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category,
          dices
        }),
      })
      .then(response => response.json())
      .then(data => {
        setScores(data.gameState.scores);
        // Reset rolls and held state based on the server's response
        setRolls(data.gameState.rolls);
        setHeld(data.gameState.held);

      })
      .catch(error => console.error('Error calculating score:', error));
  };


  return (
    <div className="App">
      <Navbar finalScore={gameOver ? finalScores : null} />
      <div className="main-content">
        <Scoreboard scores={scores} availableCategories={availableCategories} onSelectCategory={handleCategorySelect} dices={dices} />
        <Gameboard dices={dices} held={held} onToggleHold={toggleHold} onRollDice={rollDice} rolls={rolls}/>
        {gameOver && <GameOverBanner finalScore={finalScores.reduce((a, b) => a + b, 0)} />}
      </div>
    </div>
  );
}

export default App;
