import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Toys',
    'Automotive'
  ];

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <p>🎉 Free shipping on orders over $50! Use code: FREESHIP</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">ShopHub</span>
          </Link>

          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={20} />
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            <button className="action-btn wishlist-btn">
              <Heart size={22} />
            </button>
            <button className="action-btn user-btn">
              <User size={22} />
            </button>
            <Link to="/cart" className="action-btn cart-btn">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item nav-dropdown">
              <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                All Products
              </Link>
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </li>
            <li className="nav-item">
              <Link
                to="/products?sortBy=newest"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products?featured=true"
                className="nav-link nav-highlight"
                onClick={() => setIsMenuOpen(false)}
              >
                🔥 Deals
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
