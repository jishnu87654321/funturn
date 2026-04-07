const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * GET /api/categories
 * Public: list all active categories for frontend cards
 */
router.get('/', categoryController.listCategories);

/**
 * GET /api/categories/:slug
 * Public: get single category by slug
 */
router.get('/:slug', categoryController.getCategoryBySlug);

/**
 * POST /api/categories/seed
 * Dev/setup: seed initial categories (disabled in production)
 */
router.post('/seed', categoryController.seedCategories);

module.exports = router;
