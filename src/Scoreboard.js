import React from 'react';
import PropTypes from 'prop-types';

function Scoreboard({ scores, availableCategories, onSelectCategory, bonusScore, finalScore }) {
  console.log("Scores prop in Scoreboard:", scores);
  const renderCategoryButtons = (section) => {
    return Object.keys(scores[section]).map((category) => (
      <div key={category} className="score-item">
        <div className="text-content">
          <span className="score-label">{category}:</span>
          <span className="score-value">
            {scores[section][category] !== null ? scores[section][category] : '-'}
          </span>
        </div>
        {availableCategories.includes(category) && (
          <button onClick={() => onSelectCategory(category)}>Select</button>
        )}
      </div>
    ));
  };

  return (
    <div className="scoreboard">
      <div className="upper-section">
        <h2>Upper Section</h2>
        {renderCategoryButtons('upper')}
      </div>
      <div className="lower-section">
        <h2>Lower Section</h2>
        {renderCategoryButtons('lower')}
      </div>
      { }
      <div className="score-summary">
        <div className="bonus-score">
          <span>Bonus Score:</span>
          <span>{bonusScore}</span>
        </div>
        <div className="final-score">
          <span>Total Score:</span>
          <span>{finalScore}</span>
        </div>
      </div>
    </div>
  );
}

Scoreboard.propTypes = {
  scores: PropTypes.shape({
    upper: PropTypes.object.isRequired,
    lower: PropTypes.object.isRequired,
  }).isRequired,
  availableCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default Scoreboard;

