//update opportunity stages
//create signed document

const folderService = require("../services/folderService");
const documentService = require("../services/documentService");
const ghlService = require("../services/ghlService");
const rabbitsignService = require("../services/rabbitsignService");

/**
 * Handle RabbitSign webhooks:
 * 1. Parse folderId from webhook body
 * 2. Look up Folder record
 * 3. Depending on status, update GHL, fetch ZIP/PDF, upload, etc.
 *
 * This is a skeleton; you can fill in the real logic later.
 */
const rabbitsignWebhookController = async (req, res, next) => {
  try {
    const tenant = req.tenant;
    const tenantId = tenant && tenant._id;

    const payload = req.body || {};

    // TODO: adjust based on actual RabbitSign webhook format
    const folderId = payload.folderId || payload.folder_id;

    if (!folderId) {
      return res.status(400).json({
        ok: false,
        error: "Missing folderId in RabbitSign webhook payload",
      });
    }

    const folder = await folderService.getFolderById(tenantId, folderId);

    if (!folder) {
      return res.status(404).json({
        ok: false,
        error: `No folder record found for folderId "${folderId}"`,
      });
    }

    // TODO: inspect payload status to decide what to do
    // e.g., if (payload.status === "COMPLETED") { ... }

    // Placeholder: just log and return 200 for now
    // eslint-disable-next-line no-console
    console.log("[webhook] Rabbitsign payload received", {
      tenantId,
      folderId,
      payload,
    });

    return res.status(200).json({
      ok: true,
      message: "Webhook received (no-op handler for now)",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  rabbitsignWebhookController,
};
