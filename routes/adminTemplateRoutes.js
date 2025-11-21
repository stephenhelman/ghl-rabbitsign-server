const express = require("express");
const { adminAuthMiddleware } = require("../middlewares/adminMiddlewares");
const {
  createTemplateConfigAdminController,
} = require("../controllers/adminTemplateConfigController");

const router = express.Router();

// POST /admin/template-configs
router.post(
  "/admin/template-configs",
  adminAuthMiddleware,
  createTemplateConfigAdminController
);

module.exports = router;
