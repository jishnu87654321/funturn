const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const { sendError, sendSuccess } = require('../utils/apiResponse');
const applicationService = require('../services/applicationService');
const adminService = require('../services/adminService');
const Application = require('../models/Application');
const { APPLICATION_STATUSES } = require('../constants');
const { resolveStoredUploadPath } = require('../utils/storagePaths');
const { logSecurityEvent } = require('../utils/securityAuditLog');

const normalizeApplicationSummary = (application) => ({
  id: application._id,
  fullName: application.fullName || '',
  email: application.email || '',
  phoneNumber: application.phoneNumber || '',
  qualification: application.qualification || '',
  selectedCategory: application.selectedCategory?._id || application.selectedCategory || null,
  selectedCategoryName: application.selectedCategory?.name || application.selectedCategoryName || '',
  instagramLink: application.instagramLink || '',
  linkedinLink: application.linkedinLink || '',
  resumeOriginalName: application.resumeOriginalName || '',
  resumeMimeType: application.resumeMimeType || '',
  resumeSize: application.resumeSize || 0,
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
  notes: application.notes || '',
  statusHistory: application.statusHistory || [],
});

const login = asyncHandler(async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password?.trim();

  if (!email || !password) {
    return sendError(res, {
      message: 'Email and password are required',
      errors: {
        ...(email ? {} : { email: 'Email is required' }),
        ...(password ? {} : { password: 'Password is required' }),
      },
      statusCode: 422,
    });
  }

  const admin = await adminService.authenticateAdmin({ email, password });
  if (!admin) {
    logSecurityEvent('admin.login.failed', {
      email,
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    });
    return sendError(res, {
      message: 'Invalid email or password',
      statusCode: 401,
    });
  }

  logSecurityEvent('admin.login.succeeded', {
    adminId: admin._id?.toString(),
    email: admin.email,
    ip: req.ip,
    userAgent: req.get('user-agent') || '',
  });

  return sendSuccess(res, {
    message: 'Login successful',
    data: {
      token: adminService.signAdminToken(admin),
      admin: adminService.sanitizeAdmin(admin),
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  await adminService.incrementAdminTokenVersion(req.admin.id);

  logSecurityEvent('admin.logout', {
    adminId: req.admin.id,
    email: req.admin.email,
    ip: req.ip,
    userAgent: req.get('user-agent') || '',
  });

  return sendSuccess(res, {
    message: 'Logged out successfully',
  });
});

const me = asyncHandler(async (req, res) =>
  sendSuccess(res, {
    message: 'Admin session is valid',
    data: { admin: req.admin },
  })
);

const dashboardSummary = asyncHandler(async (_req, res) => {
  const summary = await applicationService.getApplicationsSummary();
  return sendSuccess(res, {
    message: 'Dashboard summary fetched successfully',
    data: summary,
  });
});

const listApplications = asyncHandler(async (req, res) => {
  const { status, category, search, page, limit, sort } = req.query;
  const result = await applicationService.getApplications({
    status,
    category,
    search,
    page,
    limit,
    sort,
  });

  return sendSuccess(res, {
    message: 'Applications fetched successfully',
    data: {
      applications: result.applications.map(normalizeApplicationSummary),
      pagination: result.pagination,
    },
  });
});

const getApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id);

  if (!application) {
    return sendError(res, {
      message: 'Application not found',
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: 'Application fetched successfully',
    data: {
      application: normalizeApplicationDetail(application),
    },
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const status = req.body?.status;
  const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 1000) : '';

  if (!status || !APPLICATION_STATUSES.includes(status)) {
    return sendError(res, {
      message: `Invalid status. Must be one of: ${APPLICATION_STATUSES.join(', ')}`,
      statusCode: 400,
    });
  }

  const application = await applicationService.updateApplicationStatus(req.params.id, status, note);
  if (!application) {
    return sendError(res, {
      message: 'Application not found',
      statusCode: 404,
    });
  }

  logSecurityEvent('admin.application.status_updated', {
    adminId: req.admin.id,
    email: req.admin.email,
    applicationId: application._id?.toString(),
    status: application.status,
    ip: req.ip,
  });

  return sendSuccess(res, {
    message: 'Application status updated successfully',
    data: {
      application: normalizeApplicationDetail(application.toObject ? application.toObject() : application),
    },
  });
});

const streamResume = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .select('resumeData resumePath resumeMimeType resumeOriginalName resumeSize')
    .lean();

  if (!application || (!application.resumeData && !application.resumePath)) {
    return sendError(res, {
      message: 'Resume not found',
      statusCode: 404,
    });
  }

  const isPdf = application.resumeMimeType === 'application/pdf';
  const dispositionType = req.query.download === '1' || !isPdf ? 'attachment' : 'inline';
  const originalName = application.resumeOriginalName || 'resume';

  res.setHeader('Content-Type', application.resumeMimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `${dispositionType}; filename="${encodeURIComponent(originalName)}"`);
  res.setHeader('X-Content-Type-Options', 'nosniff');

  logSecurityEvent('admin.application.resume_accessed', {
    adminId: req.admin.id,
    email: req.admin.email,
    applicationId: application._id?.toString(),
    download: req.query.download === '1',
    ip: req.ip,
  });

  if (application.resumeData) {
    const buffer = Buffer.isBuffer(application.resumeData)
      ? application.resumeData
      : Buffer.from(application.resumeData.buffer || application.resumeData.data || []);
    res.setHeader('Content-Length', application.resumeSize || buffer.length);
    return res.end(buffer);
  }

  const absolutePath = resolveStoredUploadPath(application.resumePath);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return sendError(res, {
      message: 'Resume file is unavailable',
      statusCode: 404,
    });
  }

  res.setHeader('Content-Length', application.resumeSize || fs.statSync(absolutePath).size);

  const stream = fs.createReadStream(absolutePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      sendError(res, { message: 'Resume file is unavailable', statusCode: 404 });
      return;
    }
    res.end();
  });
  return stream.pipe(res);
});

module.exports = {
  dashboardSummary,
  getApplication,
  listApplications,
  login,
  logout,
  me,
  streamResume,
  updateApplicationStatus,
};
