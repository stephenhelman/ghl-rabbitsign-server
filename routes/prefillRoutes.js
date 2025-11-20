// POST /tenant/:tenantId/prefill
const express = require("express");
const { tenantMiddleware } = require("../middlewares/tenantMiddleware");
const { prefillController } = require("../controllers/prefillController");

const router = express.Router();

// POST /tenant/:tenantId/prefill
router.post("/tenant/:tenantId/prefill", tenantMiddleware, prefillController);

module.exports = router;
