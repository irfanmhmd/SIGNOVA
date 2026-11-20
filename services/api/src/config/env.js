
require("dotenv").config();

const port = Number(process.env.PORT || 5000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Invalid PORT configuration");
}

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (corsOrigins.length === 0) {
  throw new Error("CORS_ORIGINS must be configured");
}

module.exports = {
  port,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins,
};
