import React from 'react';
import PropTypes from 'prop-types';


function Scoreboard({ scores, availableCategories, onSelectCategory }) {
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
            <button onClick={() => onSelectCategory(category)}>Save</button>
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
    </div>
  );
}
Scoreboard.propTypes = {
    scores: PropTypes.shape({
      upper: PropTypes.objectOf(PropTypes.number, PropTypes.null),
      lower: PropTypes.objectOf(PropTypes.number, PropTypes.null),
    }).isRequired,
  };
  
  
export default Scoreboard;

