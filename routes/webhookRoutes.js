// POST /tenant/:tenantId/webhook etc
const express = require("express");
const { tenantMiddleware } = require("../middlewares/errorMiddleware");
const {
  rabbitsignWebhookController,
} = require("../controllers/webhookController");

const router = express.Router();

router.post(
  "/tenant/:tenantId/webhooks/rabbitsign",
  tenantMiddleware,
  rabbitsignWebhookController
);

module.exports = router;
