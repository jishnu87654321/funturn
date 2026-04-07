const { sendError } = require('../utils/apiResponse');

/**
 * Global error handler — must be last middleware in app.js
 *
 * Handles:
 * - Multer upload errors
 * - Mongoose validation errors
 * - Mongoose duplicate key errors
 * - Mongoose cast errors (invalid ObjectId)
 * - Generic errors
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error('[ERROR]', err);
  }

  // --- Multer errors ---
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, {
        message: `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.`,
        statusCode: 413,
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return sendError(res, {
        message: err.field || 'Unsupported file type. Please upload a PDF, DOC, or DOCX file.',
        statusCode: 400,
      });
    }
    return sendError(res, { message: err.message, statusCode: 400 });
  }

  // --- Mongoose: Validation Error ---
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach(({ path, message }) => {
      errors[path] = message;
    });
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // --- Mongoose: Duplicate Key ---
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return sendError(res, {
      message: `A record with this ${field || 'value'} already exists.`,
      statusCode: 409,
    });
  }

  // --- Mongoose: Cast Error (bad ObjectId) ---
  if (err.name === 'CastError') {
    return sendError(res, {
      message: `Invalid value for field '${err.path}'.`,
      statusCode: 400,
    });
  }

  // --- CORS error ---
  if (err.message && err.message.startsWith('CORS:')) {
    return sendError(res, { message: err.message, statusCode: 403 });
  }

  // --- Generic / unknown error ---
  return sendError(res, {
    message: 'Something went wrong. Please try again.',
    statusCode: err.statusCode || 500,
  });
};

module.exports = errorHandler;
