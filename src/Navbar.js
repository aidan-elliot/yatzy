import React from 'react';
import Logo from './Assets/Logo white.png'

function Navbar() {
    return (
        <div className="navbar">
            {/* Logo at the top */}
            <img src={Logo} alt="Logo" className="navbar-logo" />
            {/* Buttons */}
            <button className="navbar-btn">Button 1</button>
            <button className="navbar-btn">Button 2</button>
            <button className="navbar-btn">Button 3</button>
        </div>
    );
}

export default Navbar;