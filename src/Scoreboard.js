import React from 'react';

const Scoreboard = ({ scores }) => {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      {/* Loop through scores and display */}
      {Object.entries(scores).map(([scoreName, value]) => (
        <div key={scoreName}>
          <span>{scoreName}</span>: <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default Scoreboard;