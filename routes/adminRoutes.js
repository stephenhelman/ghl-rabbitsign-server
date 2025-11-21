const express = require("express");
const { adminAuthMiddleware } = require("../middlewares/adminMiddlewares");
const {
  createOrUpdateTenantAdminController,
} = require("../controllers/adminTenantController");

const router = express.Router();

// POST /admin/tenants
router.post(
  "/admin/tenants",
  adminAuthMiddleware,
  createOrUpdateTenantAdminController
);

module.exports = router;
