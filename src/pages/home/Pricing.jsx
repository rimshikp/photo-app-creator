import React from 'react';
import './../assets/styles/pricing.css';

const Pricing = () => {
  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "Free",
      features: [
        "10 uploads per month",
        "Basic analytics",
        "70% royalty rate",
        "Community support"
      ],
      recommended: false
    },
    {
      id: 2,
      name: "Professional",
      price: "$9.99",
      period: "/month",
      features: [
        "Unlimited uploads",
        "Advanced analytics",
        "80% royalty rate",
        "Priority support",
        "Custom portfolio page"
      ],
      recommended: true
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$29.99",
      period: "/month",
      features: [
        "Unlimited uploads",
        "Premium analytics",
        "85% royalty rate",
        "24/7 support",
        "Custom domain",
        "Marketing tools"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.id} className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}>
              {plan.recommended && <div className="recommended-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="amount">{plan.price}</span>
                {plan.period && <span className="period">{plan.period}</span>}
              </div>
              <ul className="features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button className="btn btn-primary">Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;