import React from 'react';
import PropTypes from 'prop-types';


// Functional component to represent the scoreboard
function Scoreboard({ scores, availableCategories, onSelectCategory }) {
  
  // Function to render buttons for each scoring category in a section (upper or lower)
  const renderCategoryButtons = (section) => {
    return (
      // Mapping through each category in the given section
      Object.keys(scores[section]).map((category) => (
        <div key={category} className="score-item">
          {/* Div to hold the text content of the score item */}
          <div className="text-content">
            {/* Span to display the category label */}
            <span className="score-label">{category}:</span>
            {/* Span to display the score value or '-' if no score is set */}
            <span className="score-value">
              {scores[section][category] !== null ? scores[section][category] : '-'}
            </span>
          </div>
          {/* Conditional rendering of the Save button based on whether the category is available for selection */}
          {availableCategories.includes(category) && (
            <button onClick={() => onSelectCategory(category)}>Save</button>
          )}
        </div>
      ))
    );
  };

  // Rendering the scoreboard with upper and lower sections
  return (
    <div className="scoreboard">
      {/* Upper section of the scoreboard */}
      <div className="upper-section">
        <h2>Upper Section</h2>
        {/* Rendering category buttons for the upper section */}
        {renderCategoryButtons('upper')}
      </div>
      {/* Lower section of the scoreboard */}
      <div className="lower-section">
        <h2>Lower Section</h2>
        {/* Rendering category buttons for the lower section */}
        {renderCategoryButtons('lower')}
      </div>
    </div>
  );
}

// Defining propTypes for the Scoreboard component to enforce specific types for props
Scoreboard.propTypes = {
  // Ensuring scores prop is an object with specific shape
  scores: PropTypes.shape({
    upper: PropTypes.objectOf(PropTypes.number, PropTypes.null),
    lower: PropTypes.objectOf(PropTypes.number, PropTypes.null),
  }).isRequired,
  // Ensuring availableCategories prop is an array of strings
  availableCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  // Ensuring onSelectCategory prop is a function
  onSelectCategory: PropTypes.func.isRequired,
};

  
export default Scoreboard;

