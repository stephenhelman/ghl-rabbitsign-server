const { config } = require("../config/env");

const adminAuthMiddleware = (req, res, next) => {
  const headerToken = req.headers["x-admin-token"];

  if (!headerToken || headerToken !== config.adminToken) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: invalid admin token",
    });
  }

  return next();
};

module.exports = {
  adminAuthMiddleware,
};
