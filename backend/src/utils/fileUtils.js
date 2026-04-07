const path = require('path');
const { ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS } = require('../constants');

const PDF_SIGNATURE = '25504446';
const DOC_SIGNATURE = 'd0cf11e0a1b11ae1';
const ZIP_SIGNATURE = '504b0304';

/**
 * Validates a resume file by extension, declared mime type, and detected file signature.
 * Returns { valid: true, detectedMime } or { valid: false, message: '...' }.
 */
const validateResumeFile = async (file) => {
  if (!file) {
    return { valid: false, message: 'Resume is required' };
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      message: `Unsupported file extension '${ext}'. Accepted: .pdf, .doc, .docx`,
    };
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      message: 'Unsupported file type. Please upload a PDF, DOC, or DOCX file.',
    };
  }

  const header = file.buffer?.subarray(0, 8) || null;

  if (!header) {
    return {
      valid: false,
      message: 'Unable to validate the uploaded file. Please try again.',
    };
  }

  const signature = header.toString('hex').toLowerCase();
  let detectedMime = file.mimetype;

  if (ext === '.pdf') {
    if (!signature.startsWith(PDF_SIGNATURE)) {
      return {
        valid: false,
        message: 'Invalid PDF file. Please upload a valid PDF document.',
      };
    }

    detectedMime = 'application/pdf';
  }

  if (ext === '.doc') {
    if (!signature.startsWith(DOC_SIGNATURE)) {
      return {
        valid: false,
        message: 'Invalid DOC file. Please upload a valid Word document.',
      };
    }

    detectedMime = 'application/msword';
  }

  if (ext === '.docx') {
    if (!signature.startsWith(ZIP_SIGNATURE)) {
      return {
        valid: false,
        message: 'Invalid DOCX file. Please upload a valid Word document.',
      };
    }

    detectedMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  return {
    valid: true,
    detectedMime,
  };
};

/**
 * Converts bytes to MB string for display.
 */
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

module.exports = { validateResumeFile, formatFileSize };
