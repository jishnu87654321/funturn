const Category = require('../models/Category');
const cacheStore = require('../utils/cacheStore');

const ACTIVE_CATEGORIES_CACHE_KEY = 'categories:active';
const ACTIVE_CATEGORIES_TTL_MS = 5 * 60 * 1000;

/**
 * Category Service — Business logic for category operations.
 * Separated from controller to keep controllers thin.
 */

/**
 * Get all active categories sorted by sortOrder then name.
 */
const getActiveCategories = async () => {
  return cacheStore.getOrSet(
    ACTIVE_CATEGORIES_CACHE_KEY,
    async () =>
      Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .select('-__v')
        .lean(),
    ACTIVE_CATEGORIES_TTL_MS,
  );
};

/**
 * Get a single category by slug.
 */
const getCategoryBySlug = async (slug) => {
  return Category.findOne({ slug: slug.toLowerCase(), isActive: true })
    .select('-__v')
    .lean();
};

/**
 * Verify a category exists by ObjectId.
 * Used during application submission.
 */
const getCategoryById = async (id) => {
  return Category.findById(id).select('name slug isActive').lean();
};

module.exports = { getActiveCategories, getCategoryBySlug, getCategoryById };
