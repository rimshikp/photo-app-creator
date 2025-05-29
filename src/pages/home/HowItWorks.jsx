import React from 'react';
import './../assets/styles/how-it-works.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Account",
      description: "Sign up as a photographer in just a few minutes."
    },
    {
      id: 2,
      title: "Upload Your Work",
      description: "Add your photos, set prices, and organize into collections."
    },
    {
      id: 3,
      title: "Get Discovered",
      description: "Buyers browse and purchase your photos from our marketplace."
    },
    {
      id: 4,
      title: "Get Paid",
      description: "Receive payments directly to your account."
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          {steps.map(step => (
            <div key={step.id} className="step">
              <div className="step-number">{step.id}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;