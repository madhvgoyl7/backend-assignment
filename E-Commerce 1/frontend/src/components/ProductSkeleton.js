import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image skeleton"></div>
      <div className="skeleton-content">
        <div className="skeleton-category skeleton"></div>
        <div className="skeleton-name skeleton"></div>
        <div className="skeleton-rating skeleton"></div>
        <div className="skeleton-price skeleton"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
