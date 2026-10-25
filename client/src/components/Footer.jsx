import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>The Food Corner</h4>
          <p>
            A cozy neighborhood restaurant offering delightful starters, traditional
            main courses, and artisanal desserts. Dedicated to fresh flavors,
            warm hospitality, and stress-free dining.
          </p>
        </div>

        <div className="footer-col">
          <h4>Opening Hours</h4>
          <ul>
            <li><strong>Lunch:</strong> 12:00 PM – 03:30 PM</li>
            <li><strong>Dinner:</strong> 07:00 PM – 10:30 PM</li>
            <li>Open All 7 Days a Week</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact & Location</h4>
          <ul>
            <li> 142 Heritage Boulevard, City Center</li>
            <li> +91 98765 43210</li>
            <li> reservations@thefoodcorner.example</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} The Food Corner. All rights reserved.</div>
        <div>Full Stack Development (FSD) Lab Mini Project &bull; MERN Stack</div>
      </div>
    </footer>
  );
};

export default Footer;
