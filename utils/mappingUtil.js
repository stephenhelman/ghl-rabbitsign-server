// utils/mapping.util.js
const { getByPath, setByPath } = require("./pathUtil");

const buildCtxFromMapping = (raw, ctxMappingArray, date) => {
  const ctx = {};

  if (!ctxMappingArray || !Array.isArray(ctxMappingArray)) return ctx;

  ctxMappingArray.forEach((entry) => {
    if (!entry) return;
    const { ctxPath, ghlPath } = entry;
    if (!ctxPath || !ghlPath) return;

    const value = getByPath(raw, ghlPath);
    if (typeof value !== "undefined") {
      setByPath(ctx, ctxPath, value);
    }
  });

  return { ...ctx, date };
};

const getValueByPath = (obj, path) => {
  if (!obj || !path) return undefined;

  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
};
/**
 * Build RabbitSign senderFieldValues from a templateConfig + ctx object.
 * Expects templateConfig.senderFieldMap = [{ fieldId, source, format }, ...]
 */
const buildSenderFieldValues = (templateConfig, ctx) => {
  const map = (templateConfig && templateConfig.senderFieldMap) || [];
  return map.map((m) => {
    const value = getValueByPath(ctx, m.source);
    return {
      name: m.fieldId,
      currentValue: value,
    };
  });
};

const buildRolesFromConfig = (templateConfig, ctx) => {
  const signersCfg = (templateConfig && templateConfig.roles) || [];
  const roles = {};

  signersCfg.forEach((s) => {
    const roleKey = s.roleKey;

    if (!roleKey) {
      return;
    }

    const email = getValueByPath(ctx, s.emailSource);
    const name = getValueByPath(ctx, s.nameSource);

    roles[roleKey] = {
      email: email || "",
      name: name || "",
    };
  });

  return roles;
};

const buildSignersObject = (contact, role) => {
  return {
    role,
    name: contact.fullName,
    email: contact.email,
    contactId: contact.ghlContactId ? contact.ghlContactId : "",
  };
};

module.exports = {
  getValueByPath,
  buildSenderFieldValues,
  buildRolesFromConfig,
  buildSignersObject,
  buildCtxFromMapping,
};
