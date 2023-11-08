const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/roll-dice', (req, res) => {
  // Generates an array of 5 random dice values
  const randomDiceValues = Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6));
  
  // Sends the array back as JSON
  res.json({ dices: randomDiceValues });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
