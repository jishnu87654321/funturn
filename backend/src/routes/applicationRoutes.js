const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { upload } = require('../middlewares/uploadMiddleware');
const { requireAdminAuth } = require('../middlewares/adminAuth');
const {
  applicationValidationRules,
  handleValidationErrors,
} = require('../validators/applicationValidator');
const { applicationLimiter } = require('../middlewares/rateLimiter');

/**
 * POST /api/applications
 * Submit a new application with resume upload.
 *
 * Pipeline:
 *   1. rate limiter (per IP)
 *   2. multer upload (parses multipart, handles file)
 *   3. express-validator rules
 *   4. validation error handler
 *   5. controller
 */
router.post(
  '/',
  applicationLimiter,
  upload.single('resume'),
  applicationValidationRules,
  handleValidationErrors,
  applicationController.submitApplication
);

/**
 * GET /api/applications
 * Admin: list all applications with filters
 * Query: status, category, search, page, limit
 */
router.get('/', requireAdminAuth, applicationController.listApplications);

/**
 * GET /api/applications/:id
 * Admin: get a single application
 */
router.get('/:id', requireAdminAuth, applicationController.getApplication);

/**
 * PATCH /api/applications/:id/status
 * Admin: update application review status
 * Body: { status: string, note?: string }
 */
router.patch('/:id/status', requireAdminAuth, applicationController.updateStatus);

module.exports = router;
