import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import reservationRoutes from './routes/reservationRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db';

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for debugging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({
    status: 'OK',
    server: 'Running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/reservations', reservationRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Default root route
app.get('/', (req, res) => {
  res.send('The Food Corner - Reservation System Backend API is active.');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Database connection & Server initialization
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(' Successfully connected to MongoDB database.');
  } catch (err) {
    console.error(' MongoDB Connection Error:', err.message);
    console.warn(
      '⚠️  The server will continue running, but database operations will fail until MongoDB is accessible.'
    );
    console.warn(
      '👉 Tip: For local MongoDB, start the service using: "net start MongoDB" or "mongod".'
    );
    console.warn(
      '👉 Tip: For MongoDB Atlas, set MONGODB_URI in server/.env with your connection string.'
    );
  }

  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
    console.log(` Health check available at http://localhost:${PORT}/api/health`);
    console.log(` Reservations API at http://localhost:${PORT}/api/reservations`);
  });
};

startServer();
