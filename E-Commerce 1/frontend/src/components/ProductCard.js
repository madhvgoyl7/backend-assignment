import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={14} className="star filled" fill="currentColor" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={14} className="star half" fill="currentColor" />
        );
      } else {
        stars.push(<Star key={i} size={14} className="star" />);
      }
    }
    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card animate-fade-in">
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="discount-badge">-{discount}%</span>
          )}
          {product.isFeatured && (
            <span className="featured-badge">Featured</span>
          )}
          <div className="product-actions">
            <button
              className="action-btn wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart size={18} />
            </button>
            <button
              className="action-btn add-to-cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-text">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>

          <div className="product-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <span className="low-stock">Only {product.stock} left!</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
