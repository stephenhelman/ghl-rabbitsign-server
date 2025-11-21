// attach all routers
// backend/src/routes/index.js
const prefillRoutes = require("./prefillRoutes");
const tenantRoutes = require("./tenantRoutes");
const webhookRoutes = require("./webhookRoutes");

/**
 * Attach all route modules to the Express app.
 */
const registerRoutes = (app) => {
  app.use(prefillRoutes);
  /*   app.use(tenantRoutes);
  app.use(webhookRoutes); */
};

module.exports = {
  registerRoutes,
};
