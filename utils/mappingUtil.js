//apply mapping config → senderFieldValues
/**
 * Safely read a nested value from an object using a path like "seller.fullName".
 */
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
 * Apply simple formatting rules to a value based on a format string.
 */
const applyFormat = (value, format) => {
  if (value === null || value === undefined) return "";

  if (!format) {
    return String(value);
  }

  switch (format) {
    case "currency": {
      const num = Number(value);
      if (Number.isNaN(num)) return String(value);
      return `$${num.toFixed(0)}`;
    }
    case "date": {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString("en-US");
    }
    case "upper":
      return String(value).toUpperCase();
    case "lower":
      return String(value).toLowerCase();
    case "trim":
      return String(value).trim();
    default:
      return String(value);
  }
};

/**
 * Build RabbitSign senderFieldValues from a templateConfig + ctx object.
 * Expects templateConfig.senderFieldMap = [{ fieldId, source, format }, ...]
 */
const buildSenderFieldValues = (templateConfig, ctx) => {
  const map = (templateConfig && templateConfig.senderFieldMap) || [];
  return map.map((m) => {
    const raw = getValueByPath(ctx, m.source);
    const formatted = applyFormat(raw, m.format);
    return {
      fieldId: m.fieldId,
      currentValue: formatted,
    };
  });
};

/**
 * Build RabbitSign signers array from templateConfig + ctx.
 * Expects templateConfig.signers = [{ role, emailSource, nameSource }, ...]
 */
const buildSignersFromConfig = (templateConfig, ctx) => {
  const signersCfg = (templateConfig && templateConfig.signers) || [];
  return signersCfg.map((s) => {
    const email = getValueByPath(ctx, s.emailSource);
    const name = getValueByPath(ctx, s.nameSource);

    return {
      role: s.role,
      email: email || "",
      name: name || "",
    };
  });
};

module.exports = {
  getValueByPath,
  applyFormat,
  buildSenderFieldValues,
  buildSignersFromConfig,
};
