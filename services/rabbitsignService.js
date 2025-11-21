//all RabbitSign API calls
// backend/src/services/rabbitsign.service.js
// Centralized RabbitSign integration

const { config } = require("../config/env");
const { getDecryptedTenantSecrets } = require("../utils/tenantSecretsUtil");

const rabbitSignAPI = async (tenant, { method, path, body = null }) => {
  const upperMethod = method.toUpperCase();
  const url = `${config.rabbitApiBaseUrl}${path}`;

  const { rabbitSecretKey, rabbitKeyId } = getDecryptedTenantSecrets(tenant);

  // UTC time for header & signature
  const utc = new Date().toISOString().split(".")[0] + "Z";

  // Signature input: "METHOD {path} {utc} {KEY_SECRET}"
  const input = `${upperMethod} ${path} ${utc} ${rabbitSecretKey}`;
  const sigBuf = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(input)
  );
  const signature = [...new Uint8Array(sigBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  const headers = {
    "x-rabbitsign-api-time-utc": utc,
    "x-rabbitsign-api-key-id": rabbitKeyId,
    "x-rabbitsign-api-signature": signature,
    "User-Agent": "GHL-Worker/1.0",
  };

  let fetchOptions = { method: upperMethod, headers };

  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  const resp = await fetch(url, fetchOptions);
  const data = await resp.json().catch((err) => ("rabbit sign API error", err));

  console.log("Rabbit Sign folder details", {
    path,
    status: resp.status,
    ok: resp.ok,
    data,
  });

  return {
    ok: resp.ok,
    status: resp.status,
    data,
  };
};

const createFolderFromTemplate = async (tenant, templateId, payload) => {
  const path = `/api/v1/folderFromTemplate/${templateId}`;

  return rabbitSignAPI(tenant, {
    method: "POST",
    path,
    body: payload,
  });
};

const getFolderDownloadUrl = async (tenant, folderId) => {
  if (!folderId) {
    throw new Error("folderId is required to fetch folder details");
  }

  const path = `/api/v1/folder/${folderId}`;

  return rabbitSignAPI(tenant.rabbitSecretKey, tenant.rabbitKeyId, {
    method: "GET",
    path,
  });
};

module.exports = {
  createFolderFromTemplate,
  getFolderDownloadUrl,
};
