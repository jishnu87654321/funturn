const { sendError } = require('../utils/apiResponse');

/**
 * 404 Not Found handler — placed after all routes in app.js
 */
const notFound = (req, res) => {
  return sendError(res, {
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
};

module.exports = notFound;
