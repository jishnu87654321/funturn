/**
 * Standardized API response helpers.
 * All controllers use these to ensure consistent JSON structure.
 */

const sendSuccess = (res, { message = 'Success', data = null, statusCode = 200 } = {}) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const sendError = (
  res,
  { message = 'Something went wrong', errors = null, statusCode = 500 } = {}
) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
};

module.exports = { sendSuccess, sendError, sendValidationError };
