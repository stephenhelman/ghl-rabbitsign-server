// backend/src/utils/zipUtil.js (rename to match the import)
const { unzipSync } = require("fflate");

/**
 * Given a ZIP file as Uint8Array or Buffer, extract all PDFs.
 * Returns array of { filename, bytes }.
 */
const extractPdfsFromZip = (zipBytes) => {
  if (!zipBytes) {
    throw new Error("extractPdfsFromZip expects bytes (Uint8Array or Buffer)");
  }

  // Ensure Uint8Array for fflate
  const bytes =
    zipBytes instanceof Uint8Array ? zipBytes : new Uint8Array(zipBytes);

  const entries = unzipSync(bytes); // { "path/to/file.pdf": Uint8Array, ... }
  const pdfs = [];

  Object.keys(entries).forEach((name) => {
    const data = entries[name];
    if (!(data instanceof Uint8Array)) return;

    if (name.toLowerCase().endsWith(".pdf")) {
      pdfs.push({ filename: name, bytes: data });
    }
  });

  return pdfs;
};

/**
 * Convenience helper: get the "best" / first PDF from a ZIP.
 * Currently: return the first PDF found.
 */
const extractFirstPdfFromZip = (zipBytes) => {
  const pdfs = extractPdfsFromZip(zipBytes);

  if (!pdfs.length) {
    throw new Error("No PDFs found inside RabbitSign ZIP");
  }

  return pdfs[0]; // { filename, bytes }
};

module.exports = {
  extractPdfsFromZip,
  extractFirstPdfFromZip,
};
