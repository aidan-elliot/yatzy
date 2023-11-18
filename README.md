# Yahtzee Game

Aidan Elliot

Assignment 1

CST3106

  

## Description

This project is a web-based implementation of the classic dice game Yahtzee, built using React. Players can roll dice, hold onto specific dice between rolls, and choose scoring categories to accumulate points. The game continues until all scoring categories have been used, at which point the player’s final score is calculated and displayed.

  

Prebuild Mock-up

![Yahtzee_Mockup_XD](https://github.com/aidan-elliot/yatzy/assets/81194636/9f3610cf-4594-4a22-87cd-1ce4d2ee033b)

  

## Table of Contents

- [Installation](#installation)

- [Usage](#usage)

- [Game Rules](#game-rules)

- [Code Design](#code-design)

- [Server Design](#server-side-operations)
  

## Installation

To get started with the Yahtzee game, follow these steps:

  

1. **Clone the Repository**:

   ```

   git clone https://github.com/aidan-elliot/yatzy.git

   cd yatzy

   ```

  

2. **Install Dependencies**:

   ```

   npm install

   npm install @fontsource/inter

   npm install express

   npm install concurrently --save-dev

   npm install cors

   npm install lodash

   ```

3. **To start both the Express server and the React application**:

   ```

   npm run dev

   ```

  

3. **To start individually**:

   ```

   npm start

   node server.js

   ```

  

After running these commands, you should be able to access the application at `http://localhost:3000/` in your web browser.

  

The server is accessable at 'http://localhost:3001/'

  

## Usage #usage

To play the game, follow the on-screen instructions:

  

1. **Roll the Dice**: Click the "Roll Dice" button to start your turn.

2. **Hold Dice**: Click on any dice you wish to keep for the next roll.

3. **Roll Again**: You have a total of three rolls per turn, including your initial roll. After holding onto any dice you wish to keep, click "Roll Dice" again.

4. **Choose a Scoring Category**: After your rolls, choose a scoring category from the scoreboard. Your score for that round will be calculated based on the dice you have and the category you choose.

5. **Continue Playing**: Continue playing until all scoring categories have been used. The game will then calculate your final score and display it on the screen.

  

## Game Rules

Yahtzee is played with five dice and a scorecard that has two sections: the upper section and the lower section.

  

- **Upper Section**: Consists of categories for each number (1 through 6). The score for a category in the upper section is the sum of all dice showing that number.

- **Lower Section**: Includes various combinations such as three of a kind, four of a kind, full house, small straight, large straight, Yahtzee (five of a kind), and chance. Each category has its own scoring rules.

  

The goal is to accumulate the highest score possible by rolling certain combinations and strategically choosing where to score your rolls.

  

## Code Design

The Yahtzee game is built using React, employing various React features such as functional components, hooks, and context.

  

- **Components**: The application is divided into reusable components, such as `Scoreboard`, `Gameboard`, `Navbar`, and `GameOverBanner`.

- **Styling**: The game's styling is done using CSS, with class names assigned to different parts of the interface for easy styling and updates.

  

## Server-Side Operations

The Yahtzee game leverages a server-side Express application to manage the game state and perform operations like rolling dice and calculating scores.

  

### Managing GameState

The server maintains the state of the game, which includes the dice values, the held status of each die, the current scores for all categories, and the number of rolls left in a turn. When a game is in progress, the server responds to requests from the client-side application to update the game state based on user actions.

  

### Rolling Dice

When the "Roll Dice" button is clicked, a request is sent to the server to generate new dice values. The server uses a pseudo-random number generator to simulate the rolling of dice, taking into account any dice the player has chosen to hold. The server then updates the game state with the new dice values and decreases the count of rolls left.

  

### Scoring

Once the player chooses a scoring category, a POST request is sent to the server with the selected category and the current dice values. The server calculates the score for that category using the rules of Yahtzee and updates the game state. The server also checks if all categories have been scored to determine if the game is over.

  

### Resets and Turns

The server provides endpoints to reset the game to its initial state and to reset the turn (rolls and held dice) when necessary. These operations ensure that the game state remains consistent and that the rules of Yahtzee are enforced throughout the game.

  

By handling these critical operations on the server side, the game ensures fair play and integrity of the game logic, preventing any client-side manipulation of the game state. The server-side model also allows for future enhancements like multiplayer capabilities, where maintaining a centralized game state becomes crucial.
