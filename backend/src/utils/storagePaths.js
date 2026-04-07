const path = require('path');

const getUploadsRoot = () => path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads/resumes');

const resolveStoredUploadPath = (storedPath) => {
  const uploadsRoot = getUploadsRoot();
  const absolutePath = path.resolve(process.cwd(), storedPath || '');
  const normalizedUploadsRoot = `${uploadsRoot}${path.sep}`;

  if (absolutePath !== uploadsRoot && !absolutePath.startsWith(normalizedUploadsRoot)) {
    return null;
  }

  return absolutePath;
};

module.exports = {
  getUploadsRoot,
  resolveStoredUploadPath,
};
