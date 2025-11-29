//resolve tenant from :tenantId param
const tenantService = require("../services/tenantService");
const tenantMiddleware = async (req, res, next) => {
  try {
    const tenantId = req.params.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        ok: false,
        error: "Missing tenantId in route parameters",
      });
    }

    const tenantFromDB = await tenantService.getTenantById(tenantId);
    const tenant = tenantFromDB.filter((tenant) => tenant._id === tenantId)[0];
    if (!tenant) {
      return res.status(404).json({
        ok: false,
        error: `Tenant not found for id: ${tenantId}`,
      });
    }

    req.tenant = tenant;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  tenantMiddleware,
};
