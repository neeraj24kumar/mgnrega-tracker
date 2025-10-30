import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { useLocation as useLocationContext } from '../context/LocationContext';

const Header = () => {
  const location = useLocation();
  const { detectedDistrict, isDetecting, detectLocation } = useLocationContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">M</div>
          <div>
            <div className="logo-text">MGNREGA Tracker</div>
            <div className="logo-subtitle">हमारी आवाज़, हमारे अधिकार</div>
          </div>
        </Link>

        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          
          {detectedDistrict && (
            <Link 
              to={`/district/${detectedDistrict.district_code}`}
              className="btn btn-outline"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <MapPin size={16} />
              {detectedDistrict.district_name}
            </Link>
          )}
          
          {!detectedDistrict && !isDetecting && (
            <button 
              onClick={detectLocation}
              className="btn btn-outline"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <MapPin size={16} />
              Find My District
            </button>
          )}
          
          {isDetecting && (
            <div className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              <div className="loading" style={{ width: '16px', height: '16px' }}></div>
              Detecting...
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          
          {detectedDistrict && (
            <Link 
              to={`/district/${detectedDistrict.district_code}`}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MapPin size={16} />
              {detectedDistrict.district_name}
            </Link>
          )}
          
          {!detectedDistrict && !isDetecting && (
            <button 
              onClick={() => {
                detectLocation();
                setIsMobileMenuOpen(false);
              }}
              className="mobile-nav-link"
            >
              <MapPin size={16} />
              Find My District
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

