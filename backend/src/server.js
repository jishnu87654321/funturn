require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const adminService = require('./services/adminService');

const PORT = process.env.PORT || 5000;
const DB_RETRY_DELAY_MS = 15 * 1000;

let server;
let dbRetryTimer;

const assertProductionSecrets = () => {
  const lifecycleEvent = process.env.npm_lifecycle_event || '';
  const isDevelopmentBoot = lifecycleEvent === 'dev' || process.env.NODE_ENV !== 'production';

  if (isDevelopmentBoot || process.env.SKIP_ENV_VALIDATION === 'true') {
    return;
  }

  const invalidValues = [
    process.env.MONGODB_URI?.includes('replace-with-your-mongodb-uri'),
    process.env.ADMIN_EMAIL?.includes('admin@example.com'),
    process.env.ADMIN_PASSWORD?.includes('replace-with-a-strong-password'),
    process.env.ADMIN_JWT_SECRET?.includes('replace-with-a-long-random-secret'),
  ];

  if (invalidValues.some(Boolean)) {
    throw new Error('Production environment variables must be replaced with real secure values before startup');
  }
};

const syncDefaultAdmin = async () => {
  const defaultAdmin = await adminService.ensureDefaultAdmin();
  if (defaultAdmin.created) {
    console.log(`Default admin created for ${defaultAdmin.email}`);
  } else if (defaultAdmin.updated) {
    console.log(`Default admin updated for ${defaultAdmin.email}`);
  }
};

const scheduleDbReconnect = () => {
  if (dbRetryTimer) {
    return;
  }

  dbRetryTimer = setInterval(async () => {
    if (!server || !server.listening) {
      return;
    }

    const reconnected = await connectDB();
    if (!reconnected) {
      return;
    }

    clearInterval(dbRetryTimer);
    dbRetryTimer = null;
    await syncDefaultAdmin();
    console.log('MongoDB reconnect succeeded.');
  }, DB_RETRY_DELAY_MS);
};

const start = async () => {
  assertProductionSecrets();
  const dbConnected = await connectDB();

  if (dbConnected) {
    await syncDefaultAdmin();
  } else {
    console.warn('Backend started without MongoDB. Health checks will report degraded until the database is reachable.');
    scheduleDbReconnect();
  }

  server = http.createServer(app);
  server.keepAliveTimeout = 65 * 1000;
  server.headersTimeout = 66 * 1000;
  server.requestTimeout = 30 * 1000;
  server.listen(PORT, () => {
    console.log(`Funtern Backend running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  if (dbRetryTimer) {
    clearInterval(dbRetryTimer);
  }
  if (server) {
    server.close(() => process.exit(1));
    return;
  }
  process.exit(1);
});
