import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import DistrictView from './pages/DistrictView';
import About from './pages/About';
import { LocationProvider } from './context/LocationContext';
import './App.css';
import LanguagePrompt from './components/LanguagePrompt';
import { useTranslation } from 'react-i18next';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();
  const [showLangPrompt, setShowLangPrompt] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (!savedLang) setShowLangPrompt(true);
    else i18n.changeLanguage(savedLang);
  }, [i18n]);

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    setShowLangPrompt(false);
  };

  if (showLangPrompt) {
    return <LanguagePrompt onSelect={handleLanguageSelect} />;
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>MGNREGA Performance Tracker</h2>
          <p>Loading your district's data...</p>
        </div>
      </div>
    );
  }

  return (
    <LocationProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/district/:districtCode" element={<DistrictView />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;

