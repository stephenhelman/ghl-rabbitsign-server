const renderSummary = (templateConfig, property) => {
  const { propertyFullAddress } = property;

  return `${templateConfig.displayName} - ${propertyFullAddress}`;
};

module.exports = {
  renderSummary,
};
