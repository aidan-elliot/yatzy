import dice1 from './Assets/dice-six-faces-one.svg';
import dice2 from './Assets/dice-six-faces-two.svg';
import dice3 from './Assets/dice-six-faces-three.svg';
import dice4 from './Assets/dice-six-faces-four.svg';
import dice5 from './Assets/dice-six-faces-five.svg';
import dice6 from './Assets/dice-six-faces-six.svg';
import './App.css';
import '@fontsource/inter';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
        <img src={dice1} className="dice1" alt="die1" />
        <img src={dice2} className="dice2" alt="diee2" />
        <img src={dice3} className="dice3" alt="die3" />
        <img src={dice4} className="dice4" alt="die4" />
        <img src={dice5} className="dice5" alt="die5" />
        <img src={dice6} className="dice6" alt="die6" />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
}

export default App;
