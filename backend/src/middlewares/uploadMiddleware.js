const multer = require('multer');
const path = require('path');
const { ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS } = require('../constants');

// File filter — reject invalid types early (multer level)
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    ACCEPTED_MIME_TYPES.includes(file.mimetype) &&
    ACCEPTED_EXTENSIONS.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Unsupported file type. Please upload a PDF, DOC, or DOCX file.'
      ),
      false
    );
  }
};

const MAX_SIZE_BYTES =
  parseFloat(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_BYTES,
  },
});

module.exports = { upload };
