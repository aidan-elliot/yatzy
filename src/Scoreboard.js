import React from 'react';

// Defining Scoreboard functional component, receiving scores as props
function Scoreboard({ scores }) {
    // Render method for Scoreboard
    return (
        // Main container for the scoreboard
        <div className="scoreboard">
            {/* Section for displaying upper scores */}
            <div className="upper-section">
                <h2>Upper Section</h2>
                {/* Mapping through each score in the upper section and displaying it */}
                {Object.keys(scores.upper).map(key => (
                    <div key={key} className="score-item">
                        {/* Displaying the name of the score */}
                        <span className="score-label">{key}:</span>
                        {/* Displaying the value of the score, showing '-' if score is null */}
                        <span className="score-value">{scores.upper[key] || '-'}</span>
                    </div>
                ))}
            </div>
            {/* Section for displaying lower scores */}
            <div className="lower-section">
                <h2>Lower Section</h2>
                {/* Mapping through each score in the lower section and displaying it */}
                {Object.keys(scores.lower).map(key => (
                    <div key={key} className="score-item">
                        {/* Displaying the name of the score */}
                        <span className="score-label">{key}:</span>
                        {/* Displaying the value of the score, showing '-' if score is null */}
                        <span className="score-value">{scores.lower[key] || '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Exporting Scoreboard component as the default export
export default Scoreboard;
