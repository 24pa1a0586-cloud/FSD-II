import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { menuCategories, menuItems } from '../data/menuData';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on category and optional search term
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">
      <header className="page-header">
        <h1 className="page-title">Our Food Menu</h1>
        <p className="page-subtitle">
          Explore our chef-curated selection of starters, signature curries,
          tandoori breads, desserts, and refreshing beverages.
        </p>
      </header>

      {/* Category Filter and Search Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div className="menu-filters">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '240px', width: '100%' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h2 className="empty-title">No dishes found</h2>
          <p className="empty-desc">
            No menu items matched your current search criteria. Try selecting another
            category or clearing your search.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div>
                <div className="menu-card-top">
                  <div>
                    <h3 className="menu-dish-name">{item.name}</h3>
                    <div style={{ marginTop: '4px', display: 'flex', gap: '6px' }}>
                      <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}>
                        {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                      </span>
                      <span className="badge badge-category">{item.category}</span>
                    </div>
                  </div>
                  <span className="menu-price">&#8377;{item.price}</span>
                </div>
                <p className="menu-desc">{item.description}</p>
              </div>

              <div className="menu-footer">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Freshly Prepared
                </span>
                <Link to="/reserve" className="btn btn-secondary btn-sm">
                  Book Table
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
