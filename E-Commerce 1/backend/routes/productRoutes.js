const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  getPriceRange
} = require('../controllers/productController');

// Static routes first
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/price-range', getPriceRange);

// Dynamic routes
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
