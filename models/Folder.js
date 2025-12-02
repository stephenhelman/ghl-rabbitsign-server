//entry for a kv, temporary.
//hosts all info that used to be stored in KV
//used to interact with rabbitsign and ghl
const mongoose = require("mongoose");

const SignerSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const FolderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // RabbitSign folderId

    name: { type: String, required: true },

    tenantId: { type: String, ref: "Tenant", required: true },

    opportunityId: { type: String, required: true },

    signers: { type: [SignerSchema], required: true },
  },
  {
    timestamps: true,
    collection: "folders",
  }
);

FolderSchema.index({ tenantId: 1, opportunityId: 1 });
FolderSchema.index({ tenantId: 1, status: 1 });

const Folder = mongoose.model("Folder", FolderSchema);

module.exports = Folder;
