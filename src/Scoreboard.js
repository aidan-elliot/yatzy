import React from 'react';

function Scoreboard({ scores }) {
    return (
        <div className="scoreboard">
            <div className="upper-section">
                <h2>Upper Section</h2>
                {Object.keys(scores.upper).map(key => (
                    <div key={key} className="score-item">
                        <span className="score-label">{key}:</span>
                        <span className="score-value">{scores.upper[key] || '-'}</span>
                    </div>
                ))}
            </div>
            <div className="lower-section">
                <h2>Lower Section</h2>
                {Object.keys(scores.lower).map(key => (
                    <div key={key} className="score-item">
                        <span className="score-label">{key}:</span>
                        <span className="score-value">{scores.lower[key] || '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Scoreboard;
