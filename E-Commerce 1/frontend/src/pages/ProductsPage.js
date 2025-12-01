import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Pagination from '../components/Pagination';
import FilterSidebar from '../components/FilterSidebar';
import { getProducts, getCategories, getBrands, getPriceRange } from '../services/api';
import './Pages.css';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Local UI state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 20, total: 0 });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 1000 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Gather filters from query params
  const getFiltersFromParams = () => ({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 20,
    featured: searchParams.get('featured') || ''
  });

  const [filters, setFilters] = useState(getFiltersFromParams());

  useEffect(() => {
    setFilters(getFiltersFromParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [c, b, pr] = await Promise.all([getCategories(), getBrands(), getPriceRange()]);
        setCategories(c.data || []);
        setBrands(b.data || []);
        setPriceRange(pr.data || { minPrice: 0, maxPrice: 1000 });
      } catch (err) {
        console.error(err);
      }
    };
    loadMeta();
  }, []);

  useEffect(() => {
    // Load products whenever filters change
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          category: filters.category && filters.category !== 'All' ? filters.category : undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          minRating: filters.minRating || undefined,
          brand: filters.brand || undefined,
          search: filters.search || undefined,
          sortBy: filters.sortBy || undefined,
          featured: filters.featured || undefined
        };

        const res = await getProducts(params);
        setProducts(res.data || []);
        setPagination((p) => ({ ...p, page: res.pagination.page, pages: res.pagination.pages, total: res.pagination.total }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters.page, filters.limit, filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.brand, filters.search, filters.sortBy, filters.featured]);

  const updateQuery = (newValues) => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));

    Object.keys(newValues).forEach((k) => {
      const v = newValues[k];
      if (v === undefined || v === '' || v === null) {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });

    navigate({ pathname: '/products', search: params.toString() });
  };

  const handleFilterChange = (key, value) => {
    // when filters change reset to page 1
    const next = { [key]: value, page: 1 };
    updateQuery(next);
  };

  const clearFilters = () => {
    navigate('/products');
  };

  const handlePageChange = (page) => {
    updateQuery({ page });
  };

  return (
    <div className="container page products-page">
      <div className="products-top">
        <button className="btn-outline show-filters" onClick={() => setFiltersOpen(true)}>Filters</button>
        <div className="products-actions">
          <select
            value={filters.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>
        </div>
      </div>

      <div className="products-area">
        <FilterSidebar
          categories={categories}
          brands={brands}
          priceRange={priceRange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <div className="products-list">
          {loading ? (
            <div className="grid grid-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="no-results">No products found.</div>
              ) : (
                <div className="grid grid-4">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
