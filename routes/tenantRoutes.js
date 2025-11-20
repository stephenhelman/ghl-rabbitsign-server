//admin/onboarding endpoints
// backend/src/routes/tenant.routes.js
const express = require("express");
const { tenantMiddleware } = require("../middlewares/tenantMiddleware");
const {
  getCurrentTenantController,
} = require("../controllers/tenantController");

const router = express.Router();

// GET /tenant/:tenantId
router.get("/tenant/:tenantId", tenantMiddleware, getCurrentTenantController);

module.exports = router;
