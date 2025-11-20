// read/process.env helpers
import dotenv from "dotenv";

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),

  // Mongo
  mongoUri: requireEnv("MONGODB_URI"),
  mongoDbName: requireEnv("MONGODB_DB_NAME"),

  // Master key used to encrypt per-tenant API keys
  tenantSecretKey: requireEnv("TENANT_SECRET_KEY"),

  // External APIs (override in .env if needed)
  ghlApiBaseUrl:
    process.env.GHL_API_BASE_URL || "https://services.leadconnectorhq.com",
  rabbisignApiBaseUrl:
    process.env.RABBITSIGN_API_BASE_URL || "https://api.rabbitsign.com",
};
