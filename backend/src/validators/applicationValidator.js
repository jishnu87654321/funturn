const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/apiResponse');

/**
 * Application submission validation rules.
 * Covers all required fields with meaningful messages.
 */
const applicationValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-().]{7,20}$/)
    .withMessage('Valid phone number is required'),

  body('qualification')
    .trim()
    .notEmpty()
    .withMessage('Qualification is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Please enter a valid qualification'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail(),

  body('selectedCategory')
    .trim()
    .notEmpty()
    .withMessage('Please select an opportunity category')
    .isMongoId()
    .withMessage('Invalid category selected'),

  // Optional fields
  body('instagramLink')
    .optional({ values: 'falsy' })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please enter a valid Instagram URL'),
  body('linkedinLink')
    .optional({ values: 'falsy' })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please enter a valid LinkedIn URL'),
  body('collegeName').optional().trim().isLength({ max: 120 }).withMessage('College name is too long'),
  body('city').optional().trim().isLength({ max: 80 }).withMessage('City is too long'),
  body('message').optional().trim().isLength({ max: 1000 }).withMessage('Message must be 1000 characters or fewer'),
];

/**
 * Middleware that runs after validation rules.
 * Returns field-level errors in the standard format.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = {};
    errors.array().forEach((err) => {
      // Only store the first error per field
      if (!fieldErrors[err.path]) {
        fieldErrors[err.path] = err.msg;
      }
    });
    return sendValidationError(res, fieldErrors);
  }
  next();
};

module.exports = { applicationValidationRules, handleValidationErrors };
