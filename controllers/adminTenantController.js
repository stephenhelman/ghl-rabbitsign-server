// backend/src/controllers/adminTenant.controller.js
const { encryptSecret } = require("../utils/cryptoUtil");
const tenantService = require("../services/tenantService");

/**
 * POST /admin/tenants
 * Body:
 * {
 *   "tenantId": "operation_profit",
 *   "name": "Operation Profit",
 *   "ghlLocationId": "d5rQtBqw511q7isWJLCG",
 *   "ghlApiKey": "RAW_GHL_API_KEY",
 *   "rabbitSecretKey": "RAW_RABBITSIGN_SECRET",
 *   "rabbitKeyId": "RAW_RABBITSIGN_KEY_ID",
 *   "defaultPipelineId": "optional",
 *   "stageIds": {
 *     "contractSent": "stage_id_here",
 *     "sellerSigned": "stage_id_here",
 *     "fullySigned": "stage_id_here"
 *   }
 * }
 */
const createOrUpdateTenantAdminController = async (req, res, next) => {
  try {
    const {
      tenantId,
      name,
      ghlLocationId,
      ghlApiKey,
      rabbitSecretKey,
      rabbitKeyId,
      defaultPipelineId,
      stageIds,
    } = req.body || {};

    if (
      !tenantId ||
      !name ||
      !ghlLocationId ||
      !ghlApiKey ||
      !rabbitSecretKey ||
      !rabbitKeyId
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "tenantId, name, ghlLocationId, ghlApiKey, rabbitSecretKey, and rabbitKeyId are required",
      });
    }

    const encGhlKey = encryptSecret(ghlApiKey);
    const encRabbitSecret = encryptSecret(rabbitSecretKey);
    const encRabbitKeyId = encryptSecret(rabbitKeyId);

    const tenantData = {
      _id: tenantId, // string id, e.g. "operation_profit"
      name,
      ghlLocationId,
      ghlApiKey: encGhlKey,
      rabbitSecretKey: encRabbitSecret,
      rabbitKeyId: encRabbitKeyId,
      defaultPipelineId: defaultPipelineId || undefined,
      stageIds: stageIds || {},
      isActive: true,
    };

    const tenant = await tenantService.upsertTenant(tenantId, tenantData);

    return res.status(201).json({
      ok: true,
      tenantId: tenant._id,
      name: tenant.name,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createOrUpdateTenantAdminController,
};
