const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiResponse');

/**
 * Rate limiter for application submission endpoint.
 * Prevents abuse: max 10 submissions per 15 minutes per IP.
 */
const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return sendError(res, {
      message: 'Too many submissions from this IP. Please try again in 15 minutes.',
      statusCode: 429,
    });
  },
});

/**
 * General API limiter — applied globally.
 * Max 200 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return sendError(res, {
      message: 'Too many requests. Please slow down.',
      statusCode: 429,
    });
  },
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return sendError(res, {
      message: 'Too many admin login attempts. Please try again in 15 minutes.',
      statusCode: 429,
    });
  },
});

module.exports = { adminLoginLimiter, applicationLimiter, generalLimiter };
