const express = require("express");
const cors = require("cors");

const { config } = require("./config/env");
const { connectDB } = require("./config/db");
const { registerRoutes } = require("./routes");
const { errorMiddleware } = require("./middlewares/errorMiddleware");

/**
 * Create and configure the Express app (without starting the server).
 * Useful for testing.
 */
const createApp = () => {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Simple health check
  app.get("/health", (req, res) => {
    return res.status(200).json({
      ok: true,
      status: "up",
      env: config.nodeEnv,
    });
  });

  // Register feature routes
  /*   registerRoutes(app); */

  // Global error handler (must be last)
  app.use(errorMiddleware);

  return app;
};

/**
 * Connect to DB and start the HTTP server.
 */
const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();

    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(
        `[server] Listening on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[server] Failed to start:", err);
    process.exit(1);
  }
};

// If this file is run directly: start the server.
// If it's required from tests, you can call createApp() instead.
if (require.main === module) {
  // eslint-disable-next-line no-floating-promises
  startServer();
}

module.exports = {
  createApp,
  startServer,
};
