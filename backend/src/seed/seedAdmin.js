require('dotenv').config();
const mongoose = require('mongoose');
const adminService = require('../services/adminService');

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'funtern',
    });

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD?.trim();

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before running admin seed');
    }

    const result = await adminService.ensureDefaultAdmin();
    if (result.created) {
      console.log(`Created admin account for ${email}`);
    } else if (result.updated) {
      console.log(`Updated admin account for ${email}`);
    } else {
      console.log(`Skipped admin seed (${result.reason || 'unknown'})`);
    }
  } catch (error) {
    console.error(`Admin seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();
