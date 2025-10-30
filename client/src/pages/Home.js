import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Users, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { detectedDistrict, isDetecting, detectLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { t } = useTranslation();

  // Search districts
  const searchDistricts = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
        setShowResults(true);
      } else {
        toast.error('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchDistricts(query);
  };

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    navigate(`/district/${district.district_code}`);
  };

  // Handle location detection
  const handleDetectLocation = () => {
    detectLocation();
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-box')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Track Your District's MGNREGA Performance</h1>
          <p>
            Discover how your district is performing in the world's largest employment guarantee program. 
            Get insights into work provision, completion rates, and expenditure patterns.
          </p>
          <div className="hero-actions">
            {detectedDistrict ? (
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/district/${detectedDistrict.district_code}`)}
              >
                <MapPin size={20} />
                View {detectedDistrict.district_name} Data
                <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={handleDetectLocation}
                disabled={isDetecting}
              >
                <MapPin size={20} />
                {isDetecting ? 'Detecting...' : 'Find My District'}
                <ArrowRight size={20} />
              </button>
            )}
            <button 
              className="btn btn-outline"
              onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
            >
              <Search size={20} />
              Search District
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="search-section">
        <div className="search-container">
          <h2>Search Your District</h2>
          <p>Enter your district name to view detailed MGNREGA performance data</p>
          
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Type your district name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            
            {showResults && (
              <div className="search-results">
                {isSearching ? (
                  <div className="search-result-item">
                    <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((district) => (
                    <div
                      key={district.district_code}
                      className="search-result-item"
                      onClick={() => handleDistrictSelect(district)}
                    >
                      <div className="district-name">{district.district_name}</div>
                      <div className="district-state">{district.state_name}</div>
                    </div>
                  ))
                ) : (
                  <div className="search-result-item">
                    No districts found. Try a different search term.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>What You Can Track</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={24} />
              </div>
              <h3>Employment Data</h3>
              <p>
                Track how many households are demanding work, how many are getting work, 
                and the total person-days generated in your district.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Performance Trends</h3>
              <p>
                View historical trends and compare your district's performance 
                over time with detailed monthly data.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={24} />
              </div>
              <h3>Work Completion</h3>
              <p>
                Monitor work completion rates, ongoing projects, and expenditure 
                patterns including wages, materials, and administration costs.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircle size={24} />
              </div>
              <h3>Inclusive Development</h3>
              <p>
                Track participation of SC, ST, and women in the program to ensure 
                inclusive development in your district.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">12.15 Cr</div>
              <div className="stat-label">{t('Rural Indians Benefited in 2025')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">76</div>
              <div className="stat-label">{t('Districts in Uttar Pradesh')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">₹200+</div>
              <div className="stat-label">{t('Daily Wage Rate')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100</div>
              <div className="stat-label">{t('Days Guaranteed Employment')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

