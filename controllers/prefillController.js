const templateConfigService = require("../services/templateConfigService");
const folderService = require("../services/folderService");
const rabbitsignService = require("../services/rabbitsignService");
const {
  buildSenderFieldValues,
  buildRolesFromConfig,
  buildSignersObject,
  buildCtxFromMapping,
  splitIntoLines,
} = require("../utils/mappingUtil");
const { renderTitle } = require("../utils/titleUtil");
const { renderSummary } = require("../utils/summaryUtil");

/**
 * Handle prefill requests:
 * 1. Load template config for tenant + contractType
 * 2. Build RabbitSign payload (later using mapping.util)
 * 3. Call RabbitSign to create folder
 * 4. Store folder mapping in Mongo
 */

const prefillController = async (req, res, next) => {
  try {
    const tenant = req.tenant;
    const tenantId = tenant._id;
    const contractType = req.body.contractTypeFromPath;

    // 1) Load template config
    const templateConfig = await templateConfigService.getActiveTemplateConfig(
      tenantId,
      contractType
    );

    if (!templateConfig) {
      return res.status(400).json({
        ok: false,
        error: `No active template config for contractType "${contractType}"`,
      });
    }

    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    const ctx = buildCtxFromMapping(req.body, templateConfig.ctxMapping, date);
    if (ctx.deal && ctx.deal.additionalTerms) {
      ctx.deal.notesChunks = splitIntoLines(
        ctx.deal.additionalTerms,
        120, // max chars per line – tweak per template if needed
        5 // number of lines/fields you have in RabbitSign
      );
    }

    const rabbitPayload = {
      title: renderTitle(contractType, ctx.property),
      summary: renderSummary(templateConfig, ctx.property),
      date: date,
      senderFieldValues: buildSenderFieldValues(templateConfig, ctx),
      roles: buildRolesFromConfig(templateConfig, ctx),
    };

    console.log(rabbitPayload);

    // 3) Call RabbitSign to create folder
    const rabbitResp = await rabbitsignService.createFolderFromTemplate(
      tenant,
      templateConfig.rabbitTemplateId,
      rabbitPayload
    );

    if (!rabbitResp || !rabbitResp.ok || !rabbitResp.data.folderId) {
      return res.status(502).json({
        ok: false,
        error:
          "Failed to create RabbitSign folder (implement createFolderFromTemplate)",
        debug: rabbitResp,
      });
    }

    const folderId = rabbitResp.data.folderId;
    const sellerObject = buildSignersObject(ctx.seller, "Seller");
    const buyerObject = buildSignersObject(ctx.buyer, "Buyer");
    const signers = [sellerObject, buyerObject];

    // 4) Save folder record in Mongo
    await folderService.createFolderRecord(folderId, {
      tenantId,
      opportunityId: ctx.opportunityId,
      signers,
    });

    return res.status(200).json({
      ok: true,
      folderId,
      message: "Prefill request accepted (RabbitSign folder created)",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  prefillController,
};
