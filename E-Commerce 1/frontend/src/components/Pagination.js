import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`pagination-number ${page === currentPage ? 'active' : ''} ${
              page === '...' ? 'ellipsis' : ''
            }`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
