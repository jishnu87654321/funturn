const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError, sendValidationError } = require('../utils/apiResponse');
const applicationService = require('../services/applicationService');
const categoryService = require('../services/categoryService');
const { validateResumeFile } = require('../utils/fileUtils');
const { APPLICATION_STATUSES } = require('../constants');

const normalizeApplicationSummary = (application) => ({
  id: application._id,
  fullName: application.fullName || '',
  email: application.email || '',
  phoneNumber: application.phoneNumber || '',
  qualification: application.qualification || '',
  selectedCategory: application.selectedCategory?._id || application.selectedCategory || null,
  selectedCategoryName:
    application.selectedCategory?.name || application.selectedCategoryName || '',
  instagramLink: application.instagramLink || '',
  linkedinLink: application.linkedinLink || '',
  resumeOriginalName: application.resumeOriginalName || '',
  status: application.status || 'new',
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
});

const normalizeApplicationDetail = (application) => ({
  ...normalizeApplicationSummary(application),
  collegeName: application.collegeName || '',
  city: application.city || '',
  message: application.message || '',
  source: application.source || 'website',
  resumeMimeType: application.resumeMimeType || '',
  resumeSize: application.resumeSize || 0,
  statusHistory: application.statusHistory || [],
});

/**
 * POST /api/applications
 * Accepts multipart/form-data with resume file.
 * Full validation → duplicate check → DB save → success response.
 */
const submitApplication = asyncHandler(async (req, res) => {
  const {
    fullName,
    phoneNumber,
    qualification,
    email,
    selectedCategory,
    instagramLink,
    linkedinLink,
    collegeName,
    city,
    message,
  } = req.body;

  // --- Resume file check ---
  const fileValidation = await validateResumeFile(req.file);
  if (!fileValidation.valid) {
    return sendValidationError(res, { resume: fileValidation.message });
  }

  // --- Validate category exists in DB ---
  const category = await categoryService.getCategoryById(selectedCategory);
  if (!category) {
    return sendValidationError(res, {
      selectedCategory: 'Selected category not found. Please choose a valid opportunity.',
    });
  }

  if (!category.isActive) {
    return sendError(res, {
      message: 'This opportunity is currently not accepting applications.',
      statusCode: 400,
    });
  }

  // --- Duplicate detection (same email + category within 24h) ---
  const duplicate = await applicationService.checkDuplicate(email, selectedCategory);
  if (duplicate) {
    return sendError(res, {
      message:
        'You have already applied for this opportunity recently. Please wait before reapplying.',
      statusCode: 409,
    });
  }

  // --- Create application ---
  const application = await applicationService.createApplication({
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    qualification: qualification.trim(),
    email: email.trim().toLowerCase(),
    selectedCategory: category._id,
    selectedCategoryName: category.name,
    instagramLink: instagramLink?.trim() || '',
    linkedinLink: linkedinLink?.trim() || '',
    resumePath: '',
    resumeData: req.file.buffer,
    resumeOriginalName: req.file.originalname,
    resumeMimeType: fileValidation.detectedMime || req.file.mimetype,
    resumeSize: req.file.size,
    collegeName: collegeName?.trim() || '',
    city: city?.trim() || '',
    message: message?.trim() || '',
  });

  return sendSuccess(res, {
    message: 'Application submitted successfully! We will get back to you soon. 🎉',
    statusCode: 201,
    data: {
      applicationId: application._id,
      applicantName: application.fullName,
      email: application.email,
      category: category.name,
      status: application.status,
      submittedAt: application.createdAt,
      qualification: application.qualification,
    },
  });
});

/**
 * GET /api/applications
 * Admin-ready: list all applications with optional filtering and pagination.
 * Query params: status, category, search, page, limit
 */
const listApplications = asyncHandler(async (req, res) => {
  const { status, category, search, page, limit } = req.query;
  const result = await applicationService.getApplications({
    status,
    category,
    search,
    page,
    limit,
  });

  return sendSuccess(res, {
    message: 'Applications retrieved successfully',
    data: {
      applications: result.applications.map(normalizeApplicationSummary),
      pagination: result.pagination,
    },
  });
});

/**
 * GET /api/applications/:id
 * Get a single application by ID.
 */
const getApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id);

  if (!application) {
    return sendError(res, {
      message: 'Application not found',
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: 'Application retrieved successfully',
    data: { application: normalizeApplicationDetail(application) },
  });
});

/**
 * PATCH /api/applications/:id/status
 * Update application review status (admin action).
 * Body: { status: 'reviewed' | 'shortlisted' | 'rejected', note: '...' }
 */
const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!status || !APPLICATION_STATUSES.includes(status)) {
    return sendError(res, {
      message: `Invalid status. Must be one of: ${APPLICATION_STATUSES.join(', ')}`,
      statusCode: 400,
    });
  }

  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    status,
    note
  );

  if (!application) {
    return sendError(res, {
      message: 'Application not found',
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: `Application status updated to '${status}'`,
    data: {
      applicationId: application._id,
      status: application.status,
      statusHistory: application.statusHistory,
    },
  });
});

module.exports = { submitApplication, listApplications, getApplication, updateStatus };
