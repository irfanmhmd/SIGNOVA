const express = require("express");
const cors = require("cors");

const { corsOrigins } = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const riskRoutes = require("./routes/risk.routes");

const {
  notFoundHandler,
  errorHandler
} = require("./middleware/error-handler");

const app = express();

// Allow configured frontend origins
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

// Parse JSON requests
app.use(express.json({ limit: "100kb" }));

// Health check endpoint
app.use("/health", healthRoutes);
app.use("/risk", riskRoutes);

// Handle unknown routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
