const renderTitle = (contractType, property) => {
  const { propertyFullAddress } = property;

  return `${contractType.toUpperCase()} - ${propertyFullAddress}`;
};

module.exports = {
  renderTitle,
};
