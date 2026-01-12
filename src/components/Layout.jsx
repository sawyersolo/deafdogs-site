import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import rainVideo from '../assets/rain.mp4';
import '../styles.css';

export default function Layout({ children }) {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Global background video */}
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={rainVideo} type="video/mp4" />
      </video>

      {/* Optional overlay for contrast */}
      <div className="bg-video-overlay" />

      <header>
        <div className="navbar">
          <div className="nav-main">
            <div className="nav-logo">
              DEAF DOGS
            </div>

            <nav className="nav-links" aria-label="Main navigation">
              <Link to="/">Home</Link>
              <Link to="/music">Music</Link>
              <Link to="/merch">Merch</Link>        
              <Link to="/photos">Photos</Link>      
              <Link to="/press">Press</Link>
            </nav>

            <div className="nav-actions">
              <a
                href="https://instagram.com/deafdogshq"
                className="theme-toggle"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>

            <button
              type="button"
              className="hamburger"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen(open => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/photos" onClick={() => setMobileOpen(false)}>Photos</Link>
          <Link to="/music" onClick={() => setMobileOpen(false)}>Music</Link>
          <Link to="/tour" onClick={() => setMobileOpen(false)}>Tour</Link>
          <Link to="/merch" onClick={() => setMobileOpen(false)}>Merch</Link>
          <Link to="/press" onClick={() => setMobileOpen(false)}>Press</Link>
        </div>
      </header>

      <main className="page-container">
        {children}
      </main>
    </>
  );
}
