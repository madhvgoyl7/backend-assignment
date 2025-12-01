import React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({
  categories,
  brands,
  priceRange,
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = React.useState({
    category: true,
    price: true,
    rating: true,
    brand: true
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    filters.brand;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`filter-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h2>Filters</h2>
          <button className="filter-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear All Filters
          </button>
        )}

        {/* Category Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection('category')}
          >
            <span>Category</span>
            {expandedSections.category ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.category && (
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category || filters.category === 'All'}
                  onChange={() => onFilterChange('category', 'All')}
                />
                <span className="checkmark"></span>
                <span className="option-label">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => onFilterChange('category', category)}
                  />
                  <span className="checkmark"></span>
                  <span className="option-label">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection('price')}
          >
            <span>Price Range</span>
            {expandedSections.price ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.price && (
            <div className="filter-options">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min</label>
                  <input
                    type="number"
                    placeholder={`$${priceRange.minPrice || 0}`}
                    value={filters.minPrice || ''}
                    onChange={(e) => onFilterChange('minPrice', e.target.value)}
                    min={0}
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input-group">
                  <label>Max</label>
                  <input
                    type="number"
                    placeholder={`$${priceRange.maxPrice || 1000}`}
                    value={filters.maxPrice || ''}
                    onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                    min={0}
                  />
                </div>
              </div>
              <div className="price-presets">
                <button onClick={() => {
                  onFilterChange('minPrice', '');
                  onFilterChange('maxPrice', '50');
                }}>Under $50</button>
                <button onClick={() => {
                  onFilterChange('minPrice', '50');
                  onFilterChange('maxPrice', '100');
                }}>$50 - $100</button>
                <button onClick={() => {
                  onFilterChange('minPrice', '100');
                  onFilterChange('maxPrice', '200');
                }}>$100 - $200</button>
                <button onClick={() => {
                  onFilterChange('minPrice', '200');
                  onFilterChange('maxPrice', '');
                }}>$200+</button>
              </div>
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection('rating')}
          >
            <span>Rating</span>
            {expandedSections.rating ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.rating && (
            <div className="filter-options">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="filter-option rating-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating.toString()}
                    onChange={() => onFilterChange('minRating', rating.toString())}
                  />
                  <span className="checkmark"></span>
                  <span className="stars">
                    {'★'.repeat(rating)}
                    {'☆'.repeat(5 - rating)}
                  </span>
                  <span className="option-label">& Up</span>
                </label>
              ))}
              <label className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  checked={!filters.minRating}
                  onChange={() => onFilterChange('minRating', '')}
                />
                <span className="checkmark"></span>
                <span className="option-label">All Ratings</span>
              </label>
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection('brand')}
          >
            <span>Brand</span>
            {expandedSections.brand ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.brand && (
            <div className="filter-options scrollable">
              <label className="filter-option">
                <input
                  type="radio"
                  name="brand"
                  checked={!filters.brand}
                  onChange={() => onFilterChange('brand', '')}
                />
                <span className="checkmark"></span>
                <span className="option-label">All Brands</span>
              </label>
              {brands.map((brand) => (
                <label key={brand} className="filter-option">
                  <input
                    type="radio"
                    name="brand"
                    checked={filters.brand === brand}
                    onChange={() => onFilterChange('brand', brand)}
                  />
                  <span className="checkmark"></span>
                  <span className="option-label">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Apply Button */}
        <div className="filter-apply-mobile">
          <button className="apply-filters-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
