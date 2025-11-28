const TemplateConfig = require("../models/TemplateConfig");

/**
 * POST /admin/template-configs
 *
 * Body example:
 * {
 *   "tenantId": "operation_profit",
 *   "contractType": "cash",
 *   "rabbitTemplateId": "tmpl_123",
 *   "displayName": "Cash Purchase Agreement",
 *   "titleTemplate": "{{contractType}} - {{property.address}}",
 *   "version": 1,
 *   "senderFieldMap": [
 *     {
 *       "fieldId": "fld_seller_full_name",
 *       "source": "seller.fullName",
 *       "format": null
 *     },
 *     {
 *       "fieldId": "fld_property_address",
 *       "source": "property.address",
 *       "format": "upper"
 *     },
 *     {
 *       "fieldId": "fld_purchase_price",
 *       "source": "deal.purchasePrice",
 *       "format": "currency"
 *     }
 *   ],
 *   "signers": [
 *     {
 *       "roleKey": "Seller",
 *       "emailSource": "seller.email",
 *       "nameSource": "seller.fullName"
 *     },
 *     {
 *       "roleKey": "Buyer",
 *       "emailSource": "buyer.email",
 *       "nameSource": "buyer.fullName"
 *     }
 *   ]
 * }
 */
const createTemplateConfigAdminController = async (req, res, next) => {
  try {
    const {
      tenantId,
      contractType,
      rabbitTemplateId,
      displayName,
      titleTemplate,
      version,
      senderFieldMap,
      roles,
      ctxMapping,
    } = req.body || {};

    if (!tenantId || !contractType || !rabbitTemplateId) {
      return res.status(400).json({
        ok: false,
        error: "tenantId, contractType, rabbitTemplateId are required",
      });
    }

    const doc = new TemplateConfig({
      tenantId,
      contractType,
      rabbitTemplateId,
      displayName,
      titleTemplate,
      version: version || 1,
      senderFieldMap: senderFieldMap || [],
      roles: roles || [],
      ctxMapping: ctxMapping,
      isActive: true,
    });

    const saved = await doc.save();

    return res.status(201).json({
      ok: true,
      id: saved._id,
      tenantId: saved.tenantId,
      contractType: saved.contractType,
      version: saved.version,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTemplateConfigAdminController,
};
