const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAdminAuth } = require('../middlewares/adminAuth');
const { adminLoginLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/login', adminLoginLimiter, adminController.login);
router.post('/logout', requireAdminAuth, adminController.logout);
router.get('/me', requireAdminAuth, adminController.me);
router.get('/dashboard/summary', requireAdminAuth, adminController.dashboardSummary);
router.get('/applications', requireAdminAuth, adminController.listApplications);
router.get('/applications/:id', requireAdminAuth, adminController.getApplication);
router.patch('/applications/:id/status', requireAdminAuth, adminController.updateApplicationStatus);
router.get('/applications/:id/resume', requireAdminAuth, adminController.streamResume);

module.exports = router;
