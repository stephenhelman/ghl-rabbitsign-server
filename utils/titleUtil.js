//render titleTemplate
// backend/src/utils/title.util.js
const { getValueByPath } = require("./mappingUtil");

/**
 * Render a simple title template using {{path.to.value}} placeholders.
 */
const renderTitle = (template, ctx) => {
  if (!template) return "";

  return template.replace(/{{\s*([^}]+)\s*}}/g, (match, path) => {
    const val = getValueByPath(ctx, path.trim());
    if (val === null || val === undefined) return "";
    return String(val);
  });
};

module.exports = {
  renderTitle,
};
