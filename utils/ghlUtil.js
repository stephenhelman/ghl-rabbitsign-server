const { HighLevel } = require("@gohighlevel/api-client");
const { getDecryptedTenantSecrets } = require("../utils/tenantSecretsUtil");

const initializeGHL = (tenant) => {
  const { ghlApiKey } = getDecryptedTenantSecrets(tenant);

  return new HighLevel({
    privateIntegrationToken: ghlApiKey,
  });
};

module.exports = { initializeGHL };
