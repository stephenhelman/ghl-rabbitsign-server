//load per-tenant contract mappings
const TemplateConfig = require("../models/TemplateConfig");

/**
 * Get the active template config for a tenant + contractType.
 * Example: tenant "stephen_main", contractType "cash".
 */
const getActiveTemplateConfig = async (tenantId, contractType) => {
  if (!tenantId || !contractType) return null;

  return TemplateConfig.findOne({
    tenantId,
    contractType,
    isActive: true,
  })
    .sort({ version: -1 }) // highest version wins
    .exec();
};

/**
 * Create a new template config.
 */
const createTemplateConfig = async (templateConfigData) => {
  const config = new TemplateConfig(templateConfigData);
  return config.save();
};

/**
 * List all template configs for a tenant (optional helper).
 */
const listTemplateConfigsForTenant = async (tenantId) => {
  if (!tenantId) return [];
  return TemplateConfig.find({ tenantId }).exec();
};

module.exports = {
  getActiveTemplateConfig,
  createTemplateConfig,
  listTemplateConfigsForTenant,
};
