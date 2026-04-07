const { sendError } = require('../utils/apiResponse');
const adminService = require('../services/adminService');

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice('Bearer '.length).trim();
};

const requireAdminAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return sendError(res, {
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const payload = adminService.verifyAdminToken(token);
    const admin = await adminService.findAdminById(payload.sub);

    if (
      !admin ||
      admin.role !== adminService.ADMIN_ROLE ||
      (payload.tokenVersion ?? 0) !== (admin.tokenVersion || 0)
    ) {
      return sendError(res, {
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    req.admin = adminService.sanitizeAdmin(admin);
    return next();
  } catch (_error) {
    return sendError(res, {
      message: 'Unauthorized',
      statusCode: 401,
    });
  }
};

module.exports = { requireAdminAuth };
