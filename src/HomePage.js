import React from 'react';
import './HomePage.css';

import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const HomePage = () => {
  return (
    <main className="home-page">
       <section className="cta-section">
        <h3>Start Your Safe Cycling Journey Today!</h3>
        <p>
          Whether you're a regular commuter or new to cycling, our app helps you make
          informed decisions and stay safe on the road.
        </p>
        <Link to="/bicycle-routes" className="cta-button">Find Your Route</Link>
        <div></div>
      </section>

      

      <section className="features-section">
        <h3>Explore Our Features</h3>
        <div className="features-list">
          <div className="feature-card">
            <h4>Safety Data Insights</h4>
            <p>
              Analyze historical data on bicycle accidents to identify high-risk areas
              and trends in Melbourne.
            </p>
            <Link to="/safety-data" className="feature-link">Learn More</Link>
          </div>
          <div className="feature-card">
            <h4>Bicycle Routes</h4>
            <p>
              Find the best and safest bicycle routes throughout the city. Plan your
              journey with ease using our interactive map.
            </p>
            <Link to="/bicycle-routes" className="feature-link">Explore Routes</Link>
          </div>

          <div className="feature-card">
            <h4>Cycling Rules</h4>
            <p>
              Learn about cycling rules for city of Melbourne.
            </p>
            <Link to="/Safety-rules" className="feature-link"> Cycling Rules</Link>
          </div>
          
        </div>
      </section>

     
    </main>
  );
};

export default HomePage;
