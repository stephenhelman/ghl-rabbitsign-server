// services/downloadService.js
const { getFolderDownloadUrl } = require("./rabbitsignService");
const { extractFirstPdfFromZip } = require("../utils/zipUtil");

const downloadFolderZip = async (downloadUrl) => {
  if (!downloadUrl) {
    throw new Error("downloadUrl is required to download zip");
  }

  const resp = await fetch(downloadUrl, { method: "GET" });

  if (!resp.ok) {
    const text = await resp.text();
    const err = new Error(
      `Failed to download RabbitSign ZIP ${resp.status}: ${text}`
    );
    err.status = resp.status;
    err.body = text;
    throw err;
  }

  const arrayBuffer = await resp.arrayBuffer();
  const zipBuffer = Buffer.from(arrayBuffer);

  return zipBuffer;
};

const buildPdfFromRabbitFolder = async (tenant, folderId) => {
  // 1) Get folder details (this should return { data: { downloadUrl }, title, ... })
  const folderData = await getFolderDownloadUrl(tenant, folderId);

  const downloadUrl = folderData.data?.downloadUrl;
  const title = folderData.data.title;

  if (!downloadUrl) {
    const err = new Error(
      "Could not find download URL in RabbitSign folder data"
    );
    err.data = folderData;
    throw err;
  }

  // 2) Download ZIP
  const zipBuffer = await downloadFolderZip(downloadUrl);

  // 3) Extract first/best PDF
  const firstPdf = extractFirstPdfFromZip(zipBuffer); // { filename, bytes }

  if (!firstPdf || !firstPdf.bytes) {
    throw new Error("extractFirstPdfFromZip did not return PDF bytes");
  }

  const pdfBuffer = Buffer.from(firstPdf.bytes);
  const fileName = title.endsWith(".pdf") ? title : `${title}.pdf`;

  return {
    pdfBuffer,
    title,
    fileName,
    downloadUrl,
  };
};

module.exports = {
  downloadFolderZip,
  buildPdfFromRabbitFolder,
};
