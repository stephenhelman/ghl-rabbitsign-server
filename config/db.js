const mongoose = require("mongoose");
const { config } = require("./env.js");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    // Optional: quiet some deprecation warnings
    mongoose.set("strictQuery", true);

    await mongoose.connect(config.mongoUri, {
      dbName: config.mongoDbName,
    });

    isConnected = true;
    console.log(`[db] Connected to MongoDB database in ${config.nodeEnv} mode`);

    return mongoose.connection;
  } catch (err) {
    console.error("[db] MongoDB connection error:", err);
    throw err;
  }
};

const getDB = () => {
  if (!isConnected) {
    throw new Error(
      "Database not connected yet. Call connectDB() during app startup."
    );
  }
  return mongoose.connection;
};

module.exports = { connectDB, getDB };
