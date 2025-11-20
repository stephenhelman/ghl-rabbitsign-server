//encryptSecret/decryptSecret
const crypto = require("crypto");
const { config } = require("../config/env");

const ALGO = "aes-256-gcm";

const getMasterKey = () => {
  const keyHex = config.tenantSecretKey;
  if (!keyHex) {
    throw new Error("TENANT_SECRET_KEY is not configured");
  }

  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    // eslint-disable-next-line no-console
    console.warn(
      "[crypto] TENANT_SECRET_KEY should be 32 bytes (64 hex chars) for aes-256-gcm"
    );
  }
  return key;
};

const encryptSecret = (plaintext) => {
  if (typeof plaintext !== "string") {
    throw new Error("encryptSecret expects a string plaintext");
  }

  const key = getMasterKey();
  const iv = crypto.randomBytes(12); // recommended IV length for GCM

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const ciphertext = Buffer.concat([enc, authTag]).toString("hex");

  return {
    iv: iv.toString("hex"),
    ciphertext,
  };
};

const decryptSecret = ({ iv, ciphertext }) => {
  if (!iv || !ciphertext) {
    throw new Error("decryptSecret requires iv and ciphertext");
  }

  const key = getMasterKey();
  const ivBuf = Buffer.from(iv, "hex");
  const data = Buffer.from(ciphertext, "hex");

  const authTag = data.slice(data.length - 16);
  const enc = data.slice(0, data.length - 16);

  const decipher = crypto.createDecipheriv(ALGO, key, ivBuf);
  decipher.setAuthTag(authTag);

  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
};

module.exports = {
  encryptSecret,
  decryptSecret,
};
