const Tenant = require("../models/Tenant");

/**
 * Get a tenant by id (tenantId).
 * Used by tenantMiddleware.
 */
const getTenantById = async (tenantId) => {
  if (!tenantId) return null;
  return Tenant.find({ tenantId: tenantId }).exec();
};

/**
 * Create a new tenant.
 * You'll wire this into an admin/onboarding route later.
 */
const createTenant = async (tenantData) => {
  const tenant = new Tenant(tenantData);
  return tenant.save();
};

/**
 * Update an existing tenant.
 */
const updateTenant = async (tenantId, update) => {
  if (!tenantId) return null;
  return Tenant.findByIdAndUpdate(tenantId, update, {
    new: true,
  }).exec();
};

module.exports = {
  getTenantById,
  createTenant,
  updateTenant,
};
