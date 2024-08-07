import React from 'react';
import './Header.css'; // Import your CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo-title">
        {/* Replace 'logo.png' with the path to your logo image */}
        
        <h1 className="header__title">Melbourne Cycling Insights</h1>
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item"><a href="/" className="header__nav-link">Home</a></li>
          <li className="header__nav-item"><a href="/safety-data" className="header__nav-link">Safety Data</a></li>
          <li className="header__nav-item"><a href="/bicycle-routes" className="header__nav-link">Bicycle Routes</a></li>
          <li className="header__nav-item"><a href="/Safety-rules" className="header__nav-link">Cycling Rules</a></li>
        </ul>
      </nav>
      
    </header>
  );
};

export default Header;
