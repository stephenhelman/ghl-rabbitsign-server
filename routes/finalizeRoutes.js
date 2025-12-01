// POST /tenant/:tenantId/prefill
const express = require("express");
const { tenantMiddleware } = require("../middlewares/tenantMiddleware");
const { finalizeController } = require("../controllers/finalizeController");

const router = express.Router();

// POST /tenant/:tenantId/prefill
router.post("/tenant/:tenantId/finalize", tenantMiddleware, finalizeController);

module.exports = router;
