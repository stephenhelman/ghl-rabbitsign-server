//global error handler
const { config } = require("../config/env");

const errorMiddleware = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("[error]", {
    message: err && err.message ? err.message : String(err),
    stack: err && err.stack ? err.stack : null,
  });

  const status = err && err.statusCode ? err.statusCode : 500;

  const response = {
    ok: false,
    error: err && err.message ? err.message : "Internal server error",
  };

  if (config && config.nodeEnv === "development") {
    response.stack = err && err.stack ? err.stack : null;
  }

  return res.status(status).json(response);
};

module.exports = {
  errorMiddleware,
};
