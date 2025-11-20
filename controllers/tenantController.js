const tenantService = require("../services/tenantService");

/**
 * Basic endpoint to fetch the current tenant (based on :tenantId + middleware).
 */
const getCurrentTenantController = async (req, res, next) => {
  try {
    const tenant = req.tenant;
    if (!tenant) {
      return res.status(404).json({ ok: false, error: "Tenant not found" });
    }

    // Don't leak encrypted keys
    const safeTenant = {
      id: tenant._id,
      name: tenant.name,
      ghlLocationId: tenant.ghlLocationId,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };

    return res.status(200).json({
      ok: true,
      tenant: safeTenant,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCurrentTenantController,
};
