//basic logging helper
const { config } = require("../config/env");

const logInfo = (message, meta) => {
  if (meta) {
    // eslint-disable-next-line no-console
    console.log("[info]", message, meta);
  } else {
    // eslint-disable-next-line no-console
    console.log("[info]", message);
  }
};

const logError = (message, meta) => {
  if (meta) {
    // eslint-disable-next-line no-console
    console.error("[error]", message, meta);
  } else {
    // eslint-disable-next-line no-console
    console.error("[error]", message);
  }
};

const logDebug = (message, meta) => {
  if (config && config.nodeEnv !== "development") return;

  if (meta) {
    // eslint-disable-next-line no-console
    console.debug("[debug]", message, meta);
  } else {
    // eslint-disable-next-line no-console
    console.debug("[debug]", message);
  }
};

module.exports = {
  logInfo,
  logError,
  logDebug,
};
