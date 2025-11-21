const prefillRoutes = require("./prefillRoutes");
/* const tenantRoutes = require("./tenant.routes"); */
const webhookRoutes = require("./webhookRoutes");
const adminRoutes = require("./adminRoutes");
const adminTemplateRoutes = require("./adminTemplateRoutes");

const registerRoutes = (app) => {
  app.use(prefillRoutes);
  /* app.use(tenantRoutes); */
  app.use(webhookRoutes);
  app.use(adminRoutes);
  app.use(adminTemplateRoutes);
};

module.exports = {
  registerRoutes,
};
