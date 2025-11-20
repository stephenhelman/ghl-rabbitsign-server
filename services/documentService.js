//signed doc metadata
const Document = require("../models/Document");

/**
 * Create a new signed document record.
 */
const createDocumentRecord = async (data) => {
  const doc = new Document(data);
  return doc.save();
};

/**
 * Get documents by folder (e.g., all docs related to a RabbitSign folder).
 */
const getDocumentsByFolder = async (tenantId, folderId) => {
  if (!tenantId || !folderId) return [];

  return Document.find({
    tenantId,
    folderId,
  }).exec();
};

/**
 * Get all documents for a given GHL contact.
 */
const getDocumentsByContact = async (tenantId, ghlContactId) => {
  if (!tenantId || !ghlContactId) return [];

  return Document.find({
    tenantId,
    ghlContactId,
  }).exec();
};

module.exports = {
  createDocumentRecord,
  getDocumentsByFolder,
  getDocumentsByContact,
};
