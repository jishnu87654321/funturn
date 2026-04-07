require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { seedData } = require('./categoryData');

/**
 * Standalone setup script for seeding the database.
 * Run via: npm run seed
 */
const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'funtern',
    });
    console.log('✅ Connected to MongoDB for seeding');

    let created = 0;
    let skipped = 0;

    for (const item of seedData) {
      const exists = await Category.findOne({ slug: item.slug });
      if (!exists) {
        await Category.create(item);
        created++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Seed Complete. Created: ${created}, Skipped: ${skipped}`);
  } catch (err) {
    console.error(`❌ Seed Error: ${err.message}`);
  } finally {
    process.exit(0);
  }
};

runSeed();
