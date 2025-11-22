const { HighLevel } = require("@gohighlevel/api-client");
const { getDecryptedTenantSecrets } = require("../utils/tenantSecretsUtil");

const initializeGHL = (tenant) => {
  const { ghlApiKey } = getDecryptedTenantSecrets(tenant);
  const locationId = tenant.ghlLocationId;

  return new HighLevel({
    clientId: locationId,
    clientSecret: ghlApiKey,
  });
};

module.exports = { initializeGHL };
