const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./db');

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const registrationsRoutes = require('./routes/registrations');
const statsRoutes = require('./routes/stats');
const winnersRoutes = require('./routes/winners');

const app = express();

// CORS configuration
const allowedOrigins = [
  config.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging (clean development logs)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoints
const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    message: 'ClubHub API server is active and healthy',
    timestamp: new Date().toISOString(),
    databaseType: db.isMongo ? 'MongoDB' : 'LocalPersistentStore'
  });
};

app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/winners', winnersRoutes);
app.use('/api/admin', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: config.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
async function startServer() {
  try {
    await db.init();
    app.listen(config.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 ClubHub API Server running on port ${config.PORT}`);
      console.log(`🌐 Health check: http://localhost:${config.PORT}/api/health`);
      console.log(`📁 Database Mode: ${db.isMongo ? 'MongoDB' : 'Persistent Storage'}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
