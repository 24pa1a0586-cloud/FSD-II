import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="nav-logo">The Food Corner</span>
          <span className="nav-tagline">Table Reservation System</span>
        </Link>

        <button
          className="nav-toggle-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMenu}
              >
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-reservations"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMenu}
              >
                My Reservations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reserve"
                className={({ isActive }) =>
                  `nav-link nav-cta ${isActive ? 'active' : ''}`
                }
                onClick={closeMenu}
              >
                Book a Table
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
