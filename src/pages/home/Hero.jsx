import React from 'react';
import heroImage from './../assets/images/hero-bg.jpg';
import './../assets/styles/hero.css';

const Hero = () => {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1>Sell Your Photography Like Never Before</h1>
          <p>Join thousands of photographers earning from their passion. Our platform makes it easy to showcase and sell your work worldwide.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Start Selling Today</button>
            <button className="btn btn-outline">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;