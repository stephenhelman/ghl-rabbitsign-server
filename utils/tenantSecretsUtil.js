// backend/src/utils/tenantSecrets.util.js
const { decryptSecret } = require("./cryptoUtil");

const getDecryptedTenantSecrets = (tenant) => {
  if (!tenant) {
    throw new Error("getDecryptedTenantSecrets: tenant is required");
  }

  const { ghlApiKey, rabbitSecretKey, rabbitKeyId } = tenant;

  const result = {};

  if (ghlApiKey && ghlApiKey.ciphertext && ghlApiKey.iv) {
    result.ghlApiKey = decryptSecret({
      iv: ghlApiKey.iv,
      ciphertext: ghlApiKey.ciphertext,
    });
  }

  if (rabbitSecretKey && rabbitSecretKey.ciphertext && rabbitSecretKey.iv) {
    result.rabbitSecretKey = decryptSecret({
      iv: rabbitSecretKey.iv,
      ciphertext: rabbitSecretKey.ciphertext,
    });
  }

  if (rabbitKeyId && rabbitKeyId.ciphertext && rabbitKeyId.iv) {
    result.rabbitKeyId = decryptSecret({
      iv: rabbitKeyId.iv,
      ciphertext: rabbitKeyId.ciphertext,
    });
  }

  return result;
};

module.exports = {
  getDecryptedTenantSecrets,
};
