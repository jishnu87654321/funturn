const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const corsOptions = require('./config/cors');
const { generalLimiter } = require('./middlewares/rateLimiter');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const categoryRoutes = require('./routes/categoryRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.set('trust proxy', 1);

// --- Security & Utility Middlewares ---
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors(corsOptions));
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Global Rate Limiter ---
app.use('/api', generalLimiter);

// --- Health Check ---
app.get('/api/health', (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? 'Funtern API is running smoothly' : 'Funtern API is degraded',
    data: {
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: dbConnected ? 'connected' : 'disconnected',
    },
  });
});

// --- API Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 & Error Handling ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
