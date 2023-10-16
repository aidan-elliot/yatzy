import React from 'react';

const Controls = ({ onRoll }) => {
  return (
    <div className="controls">
      <button onClick={onRoll}>Roll</button>
    </div>
  );
};

export default Controls;
