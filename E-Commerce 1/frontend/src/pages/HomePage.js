import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Pages.css';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const f = await getFeaturedProducts(8);
        setFeatured(f.data || []);
        const c = await getCategories();
        setCategories(c.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container page home-page">
      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1>ShopHub — Curated products, great prices</h1>
            <p className="lead">Discover featured items, top categories and latest arrivals.</p>
            <Link to="/products" className="btn-primary">Shop All Products</Link>
          </div>
          <div className="hero-image" aria-hidden>
            <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200" alt="Shop" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products?featured=true" className="link-muted">See all</Link>
        </div>
        <div className="grid grid-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton placeholder"></div>
            ))
          ) : (
            featured.map((p) => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
        </div>
        <div className="categories-grid">
          {categories.slice(0, 8).map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="category-card">
              <div className="category-name">{c}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
