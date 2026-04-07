const fs = require('fs');
const path = require('path');
const { resolveStoredUploadPath } = require('../utils/storagePaths');

/**
 * File Upload Service — abstraction layer over storage.
 * Currently uses local disk. Can be swapped for S3/Cloudinary later
 * by replacing the methods in this file only.
 */

/**
 * Returns the public-accessible relative path for a given stored file.
 * This is what gets stored in the database.
 */
const getStoredFilePath = (filename) => {
  const uploadDir = process.env.UPLOAD_DIR || 'uploads/resumes';
  return path.join(uploadDir, filename).replace(/\\/g, '/');
};

/**
 * Deletes an uploaded file from disk.
 * Used when a request fails after upload.
 */
const deleteUploadedFile = (filePath) => {
  const absPath = resolveStoredUploadPath(filePath);
  if (!absPath) {
    return;
  }

  if (fs.existsSync(absPath)) {
    try {
      fs.unlinkSync(absPath);
    } catch (e) {
      console.warn('[FileService] Could not delete file:', absPath, e.message);
    }
  }
};

module.exports = { getStoredFilePath, deleteUploadedFile };
