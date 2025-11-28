const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;

  return path.split(".").reduce((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return acc[key];
  }, obj);
};

const setByPath = (obj, path, value) => {
  if (!path) return obj;

  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (
        !Object.prototype.hasOwnProperty.call(current, key) ||
        typeof current[key] !== "object" ||
        current[key] === null
      ) {
        current[key] = {};
      }
      current = current[key];
    }
  }

  return obj;
};

module.exports = {
  getByPath,
  setByPath,
};
