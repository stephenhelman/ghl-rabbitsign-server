//update opportunity stages
//create signed document

const folderService = require("../services/folderService");
const documentService = require("../services/documentService");
const ghlService = require("../services/ghlService");

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

    const folderId = payload.folderId;

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
    //if signer email (webhook payload) == seller email(folder details) => move to contract signed
    if (payload.signerEmail === folder.signers[0].email) {
      const ghlResponse = await ghlService.updateOpportunityStage(
        tenant,
        folder.opportunityId,
        tenant.stageIds.sellerSigned
      );
    }

    //if signer email (webhook payload) === buyer.email( folder details) => move to dispo => create signed doc => relate signed doc to contact and opp => upload pdf to signed doc
    if (payload.signerEmail === folder.signers[1].email) {
      const ghlResponse = await ghlService.updateOpportunityStage(
        tenant,
        folder.opportunityId,
        tenant.stageIds.fullySigned
      );
      //create a Document with necessary information
      const documentResponse = await documentService.createDocumentRecord({
        tenantId,
        folderId,
        relations: {
          contactId: folder.signers[0].contactId,
          opportunityId: ghlResponse.data.id,
        },
      });
    }
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
