//prefill folders
//get folder details

const templateConfigService = require("../services/templateConfigService");
const folderService = require("../services/folderService");
const rabbitsignService = require("../services/rabbitsignService");
const {
  buildSenderFieldValues,
  buildRolesFromConfig,
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

    const { contractType, opportunityId, seller, buyer, property, deal } =
      req.body || {};

    if (!contractType || !opportunityId) {
      return res.status(400).json({
        ok: false,
        error: "contractType and opportunityId are required",
      });
    }

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

    // 2) Build RabbitSign payload (later use mapping.util + title.util)
    const ctx = {
      tenantId,
      contractType,
      opportunityId,
      seller,
      buyer,
      property,
      deal,
      date,
    };

    // TODO: replace this placeholder with real mapping logic
    const rabbitPayload = {
      title: renderTitle(contractType, property),
      summary: renderSummary(templateConfig, property),
      date: date,
      senderFieldValues: buildSenderFieldValues(templateConfig, ctx),
      roles: buildRolesFromConfig(templateConfig, ctx),
    };

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

    // 4) Save folder record in Mongo
    await folderService.createFolderRecord(folderId, {
      tenantId,
      contractType,
      opportunityId,
      property,
      seller,
      status: "sent",
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
