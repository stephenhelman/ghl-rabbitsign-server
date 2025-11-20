//unzip + extract PDFs
// backend/src/utils/zip.util.js
const { unzipSync } = require("fflate");

/**
 * Given a ZIP file as Uint8Array, extract all PDFs inside.
 * Returns array of { filename, bytes }.
 */
const extractPdfsFromZip = (zipBytes) => {
  if (!zipBytes) {
    throw new Error("extractPdfsFromZip expects a Uint8Array");
  }

  const entries = unzipSync(zipBytes); // { "path/to/file.pdf": Uint8Array, ... }
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
 * - If there's exactly one, return it.
 * - If multiple, pick the one with the longest filename (tweak if needed).
 */
const extractFirstPdfFromZip = (zipBytes) => {
  const pdfs = extractPdfsFromZip(zipBytes);

  if (pdfs.length === 0) {
    throw new Error("No PDF files found in ZIP archive");
  }

  if (pdfs.length === 1) {
    return pdfs[0];
  }

  const best = pdfs.reduce((acc, curr) =>
    curr.filename.length > acc.filename.length ? curr : acc
  );

  // eslint-disable-next-line no-console
  console.log("Multiple PDFs found in ZIP, choosing:", {
    count: pdfs.length,
    chosen: best.filename,
  });

  return best;
};

module.exports = {
  extractPdfsFromZip,
  extractFirstPdfFromZip,
};
