const Application = require('../models/Application');
const { SOURCE_WEBSITE } = require('../constants');
const cacheStore = require('../utils/cacheStore');

const DASHBOARD_SUMMARY_CACHE_KEY = 'applications:summary';
const DASHBOARD_SUMMARY_TTL_MS = 60 * 1000;
const APPLICATION_LIST_CACHE_PREFIX = 'applications:list:';
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const SEARCH_MAX_LENGTH = 80;

/**
 * Application Service — Business logic for application operations.
 */

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const clampNumber = (value, min, max, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return Math.min(Math.max(parsedValue, min), max);
};

const clearApplicationReadCaches = () => {
  cacheStore.del(DASHBOARD_SUMMARY_CACHE_KEY);
  cacheStore.delByPrefix(APPLICATION_LIST_CACHE_PREFIX);
};

/**
 * Duplicate detection:
 * Check if the same email has already applied to the same category
 * within the last 24 hours.
 */
const checkDuplicate = async (email, categoryId) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return Application.findOne({
    email: email.toLowerCase(),
    selectedCategory: categoryId,
    createdAt: { $gte: since },
  }).lean();
};

/**
 * Create a new application record in the database.
 */
const createApplication = async (data) => {
  const application = new Application({
    ...data,
    source: SOURCE_WEBSITE,
    statusHistory: [{ status: 'new' }],
  });

  await application.save();
  clearApplicationReadCaches();
  return application;
};

const getApplicationsSummary = async () =>
  cacheStore.getOrSet(
    DASHBOARD_SUMMARY_CACHE_KEY,
    async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [totalApplications, statusBuckets, byCategory, todayApplications, recentApplications] = await Promise.all([
        Application.countDocuments({}),
        Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Application.aggregate([
          { $group: { _id: '$selectedCategoryName', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 6 },
        ]),
        Application.countDocuments({ createdAt: { $gte: todayStart } }),
        Application.find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .select('fullName email selectedCategoryName status createdAt')
          .lean(),
      ]);

      const countsByStatus = {
        new: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
      };

      for (const bucket of statusBuckets) {
        countsByStatus[bucket._id] = bucket.count;
      }

      return {
        totals: {
          totalApplications,
          newApplications: countsByStatus.new,
          reviewedApplications: countsByStatus.reviewed,
          shortlistedApplications: countsByStatus.shortlisted,
          rejectedApplications: countsByStatus.rejected,
          todayApplications,
        },
        byCategory: byCategory.map((item) => ({
          categoryName: item._id || 'Uncategorized',
          count: item.count,
        })),
        recentApplications,
      };
    },
    DASHBOARD_SUMMARY_TTL_MS,
  );

const buildSearchFilter = (rawSearch) => {
  const normalizedSearch = typeof rawSearch === 'string' ? rawSearch.trim().slice(0, SEARCH_MAX_LENGTH) : '';
  if (!normalizedSearch) {
    return null;
  }

  const escapedSearch = escapeRegex(normalizedSearch);
  const digitsOnlySearch = normalizedSearch.replace(/\D/g, '');

  if (normalizedSearch.includes('@')) {
    return {
      email: { $regex: `^${escapedSearch.toLowerCase()}` },
    };
  }

  if (digitsOnlySearch.length >= 3) {
    return {
      phoneNumber: { $regex: `^${escapeRegex(digitsOnlySearch)}` },
    };
  }

  return {
    $or: [
      { fullName: { $regex: `^${escapedSearch}`, $options: 'i' } },
      { qualification: { $regex: `^${escapedSearch}`, $options: 'i' } },
      { selectedCategoryName: { $regex: `^${escapedSearch}`, $options: 'i' } },
    ],
  };
};

/**
 * Get applications with optional filtering and pagination.
 * Admin-ready: supports status, category, search, page, limit.
 */
const getApplications = async ({ status, category, search, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const sanitizedPage = clampNumber(page, 1, Number.MAX_SAFE_INTEGER, 1);
  const sanitizedLimit = clampNumber(limit, 1, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE);
  const sanitizedSort = sort === 'oldest' ? 'oldest' : 'newest';
  const normalizedStatus = typeof status === 'string' ? status.trim() : '';
  const normalizedCategory = typeof category === 'string' ? category.trim() : '';

  const filter = {};
  const andFilters = [];

  if (normalizedStatus) {
    filter.status = normalizedStatus;
  }

  if (normalizedCategory) {
    andFilters.push({
      $or: [{ selectedCategory: normalizedCategory }, { selectedCategoryName: normalizedCategory }],
    });
  }

  const searchFilter = buildSearchFilter(search);
  if (searchFilter) {
    andFilters.push(searchFilter);
  }

  if (andFilters.length > 0) {
    filter.$and = andFilters;
  }

  const skip = (sanitizedPage - 1) * sanitizedLimit;
  const sortOrder = sanitizedSort === 'oldest' ? 1 : -1;

  const [total, applications] = await Promise.all([
    Application.countDocuments(filter),
    Application.find(filter)
      .populate('selectedCategory', 'name slug icon')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(sanitizedLimit)
      .select(
        'fullName email phoneNumber qualification selectedCategory selectedCategoryName instagramLink linkedinLink resumeOriginalName resumeMimeType resumeSize status createdAt updatedAt',
      )
      .lean(),
  ]);

  return {
    applications,
    pagination: {
      total,
      page: sanitizedPage,
      limit: sanitizedLimit,
      totalPages: Math.ceil(total / sanitizedLimit),
    },
  };
};

/**
 * Get a single application by ID.
 */
const getApplicationById = async (id) =>
  Application.findById(id)
    .populate('selectedCategory', 'name slug icon shortDescription')
    .select('-__v')
    .lean();

/**
 * Update application status with history tracking.
 */
const updateApplicationStatus = async (id, status, note = '') => {
  const application = await Application.findById(id);
  if (!application) return null;

  application.status = status;
  application.statusHistory.push({ status, note, changedAt: new Date() });
  await application.save();
  clearApplicationReadCaches();
  return application;
};

module.exports = {
  checkDuplicate,
  createApplication,
  getApplications,
  getApplicationsSummary,
  getApplicationById,
  updateApplicationStatus,
};
