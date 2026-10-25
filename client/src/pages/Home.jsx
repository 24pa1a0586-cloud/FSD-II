import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <p className="hero-tagline">Authentic Flavors & Warm Hospitality</p>
        <h1 className="hero-title">Welcome to The Food Corner</h1>
        <p className="hero-desc">
          Experience freshly prepared gourmet dishes crafted with authentic spices
          and farm-fresh ingredients. Reserve your table in seconds to avoid waiting
          queues and enjoy an unforgettable dining experience with family and friends.
        </p>
        <div className="hero-actions">
          <Link to="/reserve" className="btn btn-primary">
            Book a Table
          </Link>
          <Link to="/menu" className="btn btn-secondary">
            View Menu
          </Link>
        </div>
      </section>

      {/* Information Grid */}
      <section className="home-grid">
        {/* Opening Hours */}
        <div className="card">
          <h2 className="card-title">Opening Hours</h2>
          <div className="info-item">
            <strong>Lunch Service</strong>
            <span>12:00 PM – 03:30 PM</span>
          </div>
          <div className="info-item">
            <strong>Dinner Service</strong>
            <span>07:00 PM – 10:30 PM</span>
          </div>
          <div className="info-item">
            <strong>Operating Days</strong>
            <span>Monday through Sunday (Open all 7 days)</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 className="card-title">Contact & Location</h2>
          <div className="info-item">
            <strong>Restaurant Address</strong>
            <span>142 Heritage Boulevard, City Center, Main Road</span>
          </div>
          <div className="info-item">
            <strong>Phone Inquiries</strong>
            <span>+91 98765 43210 / (040) 2345-6789</span>
          </div>
          <div className="info-item">
            <strong>Email Support</strong>
            <span>contact@thefoodcorner.example</span>
          </div>
        </div>

        {/* Reservation Policy */}
        <div className="card">
          <h2 className="card-title">Reservation Guidelines</h2>
          <ul className="feature-list">
            <li>Tables are held for 15 minutes past scheduled time.</li>
            <li>Instant booking confirmation saved to MongoDB.</li>
            <li>Accommodates parties of 1 up to 10 guests.</li>
            <li>Effortless cancellation anytime with your email.</li>
          </ul>
        </div>
      </section>

      {/* Features Overview */}
      <section className="card">
        <h2 className="card-title" style={{ marginBottom: '16px' }}>
          Why Dine at The Food Corner?
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--accent)' }}>
              1. 100% Fresh Ingredients
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Every starter, main course, and dessert is cooked fresh to order with
              premium produce and quality culinary spices.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--accent)' }}>
              2. Comfortable Family Ambiance
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Spacious seating and soothing music suitable for family get-togethers,
              casual dinners, and special celebrations.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--accent)' }}>
              3. Guaranteed Table Seating
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Our computerized table booking system prevents overbooking and guarantees
              your table will be ready upon arrival.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
