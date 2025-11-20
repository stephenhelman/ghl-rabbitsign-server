// read/process.env helpers
require("dotenv").config();
const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),

  // Mongo
  mongoUri: requireEnv("DATABASE_URI"),

  // Master key used to encrypt per-tenant API keys
  tenantSecretKey: requireEnv("TENANT_SECRET_KEY"),

  // External APIs (override in .env if needed)
  ghlApiBaseUrl: process.env.GHL_URL || "https://services.leadconnectorhq.com",
  rabbisignApiBaseUrl:
    process.env.RABBITSIGN_URL || "https://api.rabbitsign.com",
};

module.exports = { config };
