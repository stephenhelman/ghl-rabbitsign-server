const prefillRoutes = require("./prefillRoutes");
/* const tenantRoutes = require("./tenant.routes");
const webhookRoutes = require("./webhook.routes"); */
const adminRoutes = require("./adminRoutes");

const registerRoutes = (app) => {
  app.use(prefillRoutes);
  /* app.use(tenantRoutes);
  app.use(webhookRoutes); */
  app.use(adminRoutes);
};

module.exports = {
  registerRoutes,
};
