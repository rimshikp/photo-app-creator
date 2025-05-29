import React from 'react';
import feature1 from './../assets/images/feature1.jpg';
import feature2 from './../assets/images/feature2.jpg';
import feature3 from './../assets/images/feature3.jpg';
import './../assets/styles/features.css';

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Easy Upload & Management",
      description: "Drag and drop interface for effortless photo uploads and organization.",
      image: feature1
    },
    {
      id: 2,
      title: "Global Marketplace",
      description: "Your photos seen by buyers from all around the world.",
      image: feature2
    },
    {
      id: 3,
      title: "Secure Payments",
      description: "Get paid securely with our integrated payment system.",
      image: feature3
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">Why Photographers Love Us</h2>
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-image">
                <img src={feature.image} alt={feature.title} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;