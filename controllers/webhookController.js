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

      //if request to GHL was bad
      if (ghlResponse.statusCode) {
        return res.status(ghlResponse.statusCode).json({
          message: ghlResponse.message,
          error: ghlResponse.error || "Bad Request",
        });
      }

      return res.status(200).json({
        ok: true,
        data: ghlResponse,
      });
    }

    //if signer email (webhook payload) === buyer.email( folder details) => move to dispo => create doc in database
    if (payload.signerEmail === folder.signers[1].email) {
      const ghlResponse = await ghlService.updateOpportunityStage(
        tenant,
        folder.opportunityId,
        tenant.stageIds.fullySigned
      );

      //if request to GHL was bad
      if (ghlResponse.statusCode) {
        return res.status(ghlResponse.statusCode).json({
          message: ghlResponse.message,
          error: ghlResponse.error || "Bad Request",
        });
      }

      //create a Document with necessary information
      const documentResponse = await documentService.createDocumentRecord({
        tenantId,
        folderId,
        name: folder.name,
        relations: {
          contactId: ghlResponse.data.opportunity.contact.id,
          opportunityId: ghlResponse.data.opportunity.id,
        },
        signers: {
          seller: folder.signers[0].name,
          buyer: folder.signers[1].name,
        },
      });
      return res.status(200).json({ data: documentResponse });
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
