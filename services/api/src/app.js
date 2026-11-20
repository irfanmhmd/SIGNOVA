
const express = require("express");
const cors = require("cors");

// Environment configuration
const { corsOrigins } = require("./config/env");

// Import routes
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");

// Import error handlers
const {
  notFoundHandler,
  errorHandler
} = require("./middleware/error-handler");

// Initialize Express application
const app = express();

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed"));
    }
  })
);

// Parse incoming JSON requests
app.use(express.json({ limit: "100kb" }));

// ==================================
// API ROUTES
// ==================================

// Health check endpoint
app.use("/health", healthRoutes);

// Authentication endpoints
// POST /auth/register
app.use("/auth", authRoutes);

// ==================================
// ERROR HANDLING
// ==================================

// Handle unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// Export Express application
module.exports = app;
