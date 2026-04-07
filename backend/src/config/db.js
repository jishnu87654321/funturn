const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let cachedConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (cachedConnectionPromise) {
    try {
      await cachedConnectionPromise;
      return mongoose.connection.readyState === 1;
    } catch {
      cachedConnectionPromise = null;
    }
  }

  try {
    cachedConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'funtern',
      serverSelectionTimeoutMS: 5000,
    });
    const conn = await cachedConnectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    cachedConnectionPromise = null;
    console.error(`MongoDB Connection Error: ${err.message}`);
    return false;
  }
};

module.exports = connectDB;
