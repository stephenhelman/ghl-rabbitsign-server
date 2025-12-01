const mongoose = require("mongoose");

const RelationsSchema = new mongoose.Schema(
  {
    contactId: { type: String, required: true },
    opportunityId: { type: String, required: true },
  },
  { _id: false }
);

const SignersSchema = new mongoose.Schema(
  {
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const DocumentSchema = new mongoose.Schema(
  {
    tenantId: { type: String, ref: "Tenant", required: true },
    name: { type: String, required: true },
    folderId: { type: String, ref: "Folder", required: true },
    relations: { type: RelationsSchema, required: true },
    signers: { type: SignersSchema, required: true },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
    collection: "documents",
  }
);

DocumentSchema.index({ tenantId: 1, folderId: 1 });
DocumentSchema.index({ tenantId: 1, "relations.contactId": 1 });

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
