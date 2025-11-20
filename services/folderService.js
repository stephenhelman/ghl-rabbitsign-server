//create/update/find folder records
const Folder = require("../models/Folder");

/**
 * Create a new folder record when you create a RabbitSign folder.
 */
const createFolderRecord = async (folderId, data) => {
  if (!folderId) {
    throw new Error("folderId is required to create a folder record");
  }

  const doc = new Folder(
    Object.assign({}, data, {
      _id: folderId,
    })
  );

  return doc.save();
};

/**
 * Get a folder record by its folderId + tenantId.
 */
const getFolderById = async (tenantId, folderId) => {
  if (!tenantId || !folderId) return null;

  return Folder.findOne({
    _id: folderId,
    tenantId,
  }).exec();
};

/**
 * Update folder status and optionally append a stageHistory entry.
 */
const updateFolderStatus = async (tenantId, folderId, status, meta) => {
  if (!tenantId || !folderId) return null;

  const update = {
    status,
    updatedAt: new Date(),
  };

  const historyEntry = {
    status,
    timestamp: new Date(),
    meta: meta || {},
  };

  return Folder.findOneAndUpdate(
    { _id: folderId, tenantId },
    {
      $set: update,
      $push: { stageHistory: historyEntry },
    },
    { new: true }
  ).exec();
};

/**
 * Update folder flags (for idempotency), e.g. stageSignedUpdated, etc.
 */
const updateFolderFlags = async (tenantId, folderId, flagsUpdate) => {
  if (!tenantId || !folderId) return null;

  return Folder.findOneAndUpdate(
    { _id: folderId, tenantId },
    {
      $set: Object.fromEntries(
        Object.entries(flagsUpdate).map(([key, value]) => [
          `flags.${key}`,
          value,
        ])
      ),
      updatedAt: new Date(),
    },
    { new: true }
  ).exec();
};

module.exports = {
  createFolderRecord,
  getFolderById,
  updateFolderStatus,
  updateFolderFlags,
};
