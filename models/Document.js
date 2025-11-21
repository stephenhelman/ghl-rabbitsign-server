const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    tenantId: { type: String, ref: "Tenant", required: true },
    folderId: { type: String, ref: "Folder", required: true },

    ghlContactId: { type: String },
    ghlCustomFieldId: { type: String },
    ghlFileUrl: { type: String },

    ghlCustomObjectRecordId: { type: String },

    type: { type: String, default: "signed_contract" },
    status: { type: String, default: "uploaded" },
  },
  {
    timestamps: true,
    collection: "documents",
  }
);

DocumentSchema.index({ tenantId: 1, folderId: 1 });
DocumentSchema.index({ tenantId: 1, ghlContactId: 1 });

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
