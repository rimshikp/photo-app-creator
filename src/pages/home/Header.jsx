import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <span>PhotoSell</span>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;