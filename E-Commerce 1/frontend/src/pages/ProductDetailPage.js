import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import './Pages.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container page">Loading...</div>;
  if (!product) return <div className="container page">Product not found.</div>;

  return (
    <div className="container page product-detail">
      <div className="detail-grid">
        <div className="detail-media">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-category">{product.category}</p>
          <div className="detail-price">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            <button className="btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
            <button className="btn-outline">Buy Now</button>
          </div>

          <div className="detail-meta">
            <div>Brand: <strong>{product.brand}</strong></div>
            <div>Stock: <strong>{product.stock}</strong></div>
            <div>Rating: <strong>{product.rating.toFixed(1)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
