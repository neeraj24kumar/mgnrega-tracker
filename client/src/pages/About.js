import React from 'react';
import { Users, Target, Shield, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About MGNREGA Performance Tracker</h1>
            <p className="hero-subtitle">
              Empowering citizens with transparent access to their district's performance 
              in the world's largest employment guarantee program.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is one of the 
                world's largest welfare programs, benefiting over 12.15 crore rural Indians in 2025 alone. 
                However, the complex data from government APIs is often inaccessible to the very people 
                it's designed to serve.
              </p>
              <p>
                Our mission is to bridge this gap by making MGNREGA performance data accessible, 
                understandable, and actionable for every citizen, regardless of their technical literacy 
                or data skills.
              </p>
            </div>
            <div className="mission-visual">
              <div className="mission-card">
                <Users size={48} />
                <h3>12.15 Cr</h3>
                <p>Rural Indians Benefited</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>What Makes Us Different</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Target size={24} />
              </div>
              <h3>Designed for Rural India</h3>
              <p>
                Our interface is specifically designed for low-literacy populations with 
                intuitive icons, simple language, and visual representations that make 
                complex data easy to understand.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3>Production-Ready Architecture</h3>
              <p>
                Built with scalability in mind, our system includes data caching, 
                fallback mechanisms, and robust error handling to ensure reliable 
                access for millions of users.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={24} />
              </div>
              <h3>Citizen-Centric Approach</h3>
              <p>
                Every feature is designed with the end user in mind - from automatic 
                location detection to multilingual support, ensuring accessibility 
                for all citizens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MGNREGA Info Section */}
      <section className="mgnrega-info">
        <div className="container">
          <h2>Understanding MGNREGA</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>What is MGNREGA?</h3>
              <p>
                The Mahatma Gandhi National Rural Employment Guarantee Act provides 
                a legal guarantee for 100 days of employment in every financial year 
                to adult members of any rural household willing to do public work-related 
                unskilled manual work.
              </p>
            </div>

            <div className="info-card">
              <h3>Key Features</h3>
              <ul>
                <li><CheckCircle size={16} /> 100 days of guaranteed employment per household</li>
                <li><CheckCircle size={16} /> Minimum wage rate of ₹200+ per day</li>
                <li><CheckCircle size={16} /> Focus on SC, ST, and women participation</li>
                <li><CheckCircle size={16} /> Asset creation in rural areas</li>
                <li><CheckCircle size={16} /> Transparency through social audit</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Performance Metrics</h3>
              <p>
                We track key performance indicators including work demand rates, 
                work provision rates, completion rates, person-days generated, 
                and expenditure patterns to give you a complete picture of your 
                district's performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="technical-section">
        <div className="container">
          <h2>Technical Architecture</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Data Management</h3>
              <ul>
                <li>Automated data synchronization from government APIs</li>
                <li>Local database caching for reliability</li>
                <li>Fallback mechanisms for API downtime</li>
                <li>Real-time data updates every 6 hours</li>
              </ul>
            </div>

            <div className="tech-card">
              <h3>User Experience</h3>
              <ul>
                <li>Automatic location detection</li>
                <li>Responsive design for all devices</li>
                <li>Visual data representations</li>
                <li>Multilingual support (Hindi/English)</li>
              </ul>
            </div>

            <div className="tech-card">
              <h3>Performance & Security</h3>
              <ul>
                <li>Rate limiting and DDoS protection</li>
                <li>Data encryption in transit and at rest</li>
                <li>CDN integration for fast loading</li>
                <li>Comprehensive error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Start Tracking Your District Today</h2>
            <p>
              Join thousands of citizens who are already using our platform to stay 
              informed about their district's MGNREGA performance.
            </p>
            <div className="cta-actions">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Get Started
                <ArrowRight size={20} />
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Search Your District
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="footer-info">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Data Sources</h3>
              <p>
                All data is sourced from the official Government of India APIs 
                available at data.gov.in, ensuring accuracy and reliability.
              </p>
            </div>
            <div className="footer-section">
              <h3>Privacy</h3>
              <p>
                We respect your privacy. Location data is only used to identify 
                your district and is not stored or shared with third parties.
              </p>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <p>
                For technical support or feedback, please contact us through 
                our support channels.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

