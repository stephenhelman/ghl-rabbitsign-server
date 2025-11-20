//all RabbitSign API calls
// backend/src/services/rabbitsign.service.js
// Centralized RabbitSign integration

const { config } = require("../config/env");

/**
 * Build basic headers for RabbitSign.
 * You'll likely need an API key/token per tenant.
 */
const buildRabbitHeaders = (tenant) => {
  return {
    Authorization: `Bearer ${tenant.decryptedRabbitApiKey || ""}`,
    "Content-Type": "application/json",
  };
};

const createFolderFromTemplate = async (tenant, payload) => {
  // TODO: implement real RabbitSign API call here
  // Example:
  // const url = `${config.rabbisignApiBaseUrl}/folders`;
  // await fetch(url, { method: "POST", headers: buildRabbitHeaders(tenant), body: JSON.stringify(payload) });

  return {
    ok: true,
    message: "createFolderFromTemplate not implemented yet",
    payload,
  };
};

const getFolderDownloadUrl = async (tenant, folderId) => {
  // TODO: implement RabbitSign "get folder" or "download" endpoint

  return {
    ok: false,
    message: "getFolderDownloadUrl not implemented yet",
    folderId,
  };
};

module.exports = {
  createFolderFromTemplate,
  getFolderDownloadUrl,
};
