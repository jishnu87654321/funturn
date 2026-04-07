const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const categoryService = require('../services/categoryService');
const Category = require('../models/Category');
const cacheStore = require('../utils/cacheStore');

/**
 * GET /api/categories
 * Returns all active categories for the public frontend.
 */
const listCategories = asyncHandler(async (_req, res) => {
  const categories = await categoryService.getActiveCategories();
  return sendSuccess(res, {
    message: 'Categories retrieved successfully',
    data: { categories, count: categories.length },
  });
});

/**
 * GET /api/categories/:slug
 * Returns a single active category by slug.
 */
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    return sendError(res, {
      message: `Category '${slug}' not found`,
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: 'Category retrieved successfully',
    data: { category },
  });
});

/**
 * POST /api/categories/seed (dev/setup only)
 * Seeds the database with initial categories.
 * Should be protected or removed in production.
 */
const seedCategories = asyncHandler(async (_req, res) => {
  const seedEnabled = process.env.ENABLE_CATEGORY_SEED === 'true';

  if (process.env.NODE_ENV === 'production' || !seedEnabled) {
    return sendError(res, {
      message: 'Seed endpoint is disabled',
      statusCode: 403,
    });
  }

  const { seedData } = require('../seed/categoryData');
  let created = 0;
  let skipped = 0;

  for (const item of seedData) {
    const exists = await Category.findOne({ slug: item.slug });
    if (!exists) {
      await Category.create(item);
      created++;
    } else {
      skipped++;
    }
  }

  cacheStore.delByPrefix('categories:');

  return sendSuccess(res, {
    message: `Seed complete. Created: ${created}, Skipped: ${skipped}`,
    data: { created, skipped },
  });
});

module.exports = { listCategories, getCategoryBySlug, seedCategories };
