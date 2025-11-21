const Tenant = require("../models/Tenant");

const getTenantById = async (tenantId) => {
  if (!tenantId) return null;
  return Tenant.find({ tenantId: tenantId }).exec();
};

const createTenant = async (tenantData) => {
  const tenant = new Tenant(tenantData);
  return tenant.save();
};

const updateTenant = async (tenantId, update) => {
  if (!tenantId) return null;
  return Tenant.findByIdAndUpdate(tenantId, update, {
    new: true,
  }).exec();
};

const upsertTenant = async (tenantId, data) => {
  if (!tenantId) return null;

  const payload = Object.assign({}, data, {
    _id: tenantId,
  });

  return Tenant.findByIdAndUpdate(tenantId, payload, {
    new: true,
    upsert: true,
  }).exec();
};

module.exports = {
  getTenantById,
  createTenant,
  updateTenant,
  upsertTenant,
};
