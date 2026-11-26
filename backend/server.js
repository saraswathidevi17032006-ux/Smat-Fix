const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env
dotenv.config();

const app = express();

// Configure allowed frontend origins for CORS (supports comma-separated CLIENT_URL)
const allowedOrigins = [
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g., Postman, curl, server-to-server) or listed origins
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Health-check endpoint (reports real MongoDB connection state)
app.get('/api/health', (req, res) => {
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = readyStates[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    success: true,
    message: 'Smart Fix API server is running.',
    database: dbState,
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// In single-service production builds, serve the built React app if frontend/dist exists
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const serveFrontend = process.env.NODE_ENV === 'production' && fs.existsSync(frontendIndexPath);

if (serveFrontend) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(frontendIndexPath);
  });
} else {
  // Root welcome endpoint (for API-only / development mode)
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to the Smart Fix Backend API.',
      endpoints: {
        health: '/api/health',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
    });
  });
}

// 404 & centralized error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set in environment variables.');
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Smart Fix server running on port ${PORT}`);
  });
}

startServer();
