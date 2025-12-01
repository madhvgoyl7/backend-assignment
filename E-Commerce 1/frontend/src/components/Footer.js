import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-section footer-brand">
              <Link to="/" className="footer-logo">
                <span className="logo-icon">🛍️</span>
                <span>ShopHub</span>
              </Link>
              <p className="footer-description">
                Your one-stop destination for quality products at amazing prices.
                Shop with confidence and enjoy fast shipping worldwide.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Youtube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?category=Electronics">Electronics</Link></li>
                <li><Link to="/products?category=Clothing">Clothing</Link></li>
                <li><Link to="/products?category=Home & Garden">Home & Garden</Link></li>
                <li><Link to="/products?sortBy=newest">New Arrivals</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping & Delivery</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Track Order</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">Contact Info</h3>
              <ul className="contact-list">
                <li>
                  <MapPin size={18} />
                  <span>123 Commerce Street, NY 10001</span>
                </li>
                <li>
                  <Phone size={18} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <Mail size={18} />
                  <span>support@shophub.com</span>
                </li>
              </ul>
              
              {/* Newsletter */}
              <div className="newsletter">
                <h4>Subscribe to Newsletter</h4>
                <form className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
