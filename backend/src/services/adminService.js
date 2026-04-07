const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const ADMIN_ROLE = 'admin';
const TOKEN_EXPIRY = '12h';

const getJwtSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not configured');
  }
  return secret;
};

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  email: admin.email,
  role: admin.role,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const signAdminToken = (admin) =>
  jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      tokenVersion: admin.tokenVersion || 0,
    },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRY }
  );

const verifyAdminToken = (token) => jwt.verify(token, getJwtSecret());

const findAdminById = async (id) => Admin.findById(id).lean();

const findAdminByEmail = async (email) =>
  Admin.findOne({ email: email.trim().toLowerCase() });

const authenticateAdmin = async ({ email, password }) => {
  const admin = await findAdminByEmail(email);
  if (!admin) return null;

  const passwordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordValid) return null;

  return admin;
};

const createAdmin = async ({ email, password, role = ADMIN_ROLE }) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.create({
    email: email.trim().toLowerCase(),
    passwordHash,
    role,
    tokenVersion: 0,
  });
  return admin.toObject();
};

const incrementAdminTokenVersion = async (adminId) => {
  const admin = await Admin.findById(adminId);
  if (!admin) return null;

  admin.tokenVersion = (admin.tokenVersion || 0) + 1;
  await admin.save();
  return admin.toObject();
};

const ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminRole = process.env.ADMIN_ROLE?.trim() || ADMIN_ROLE;

  if (!adminEmail || !adminPassword) {
    return { created: false, skipped: true, reason: 'missing_env' };
  }

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    const passwordMatches = await bcrypt.compare(adminPassword, existingAdmin.passwordHash);
    let updated = false;

    if (!passwordMatches) {
      existingAdmin.passwordHash = await bcrypt.hash(adminPassword, 12);
      existingAdmin.tokenVersion = (existingAdmin.tokenVersion || 0) + 1;
      updated = true;
    }

    if (existingAdmin.role !== adminRole) {
      existingAdmin.role = adminRole;
      updated = true;
    }

    if (updated) {
      await existingAdmin.save();
      return { created: false, updated: true, skipped: false, email: adminEmail };
    }

    return { created: false, skipped: true, reason: 'exists' };
  }

  await createAdmin({
    email: adminEmail,
    password: adminPassword,
    role: adminRole,
  });

  return { created: true, skipped: false, email: adminEmail };
};

module.exports = {
  ADMIN_ROLE,
  TOKEN_EXPIRY,
  authenticateAdmin,
  createAdmin,
  ensureDefaultAdmin,
  findAdminByEmail,
  findAdminById,
  sanitizeAdmin,
  signAdminToken,
  verifyAdminToken,
  incrementAdminTokenVersion,
};
