//entry for a kv, temporary.
//hosts all info that used to be stored in KV
//used to interact with rabbitsign and ghl
const mongoose = require("mongoose");

const StageHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const FlagsSchema = new mongoose.Schema(
  {
    stageSignedUpdated: { type: Boolean, default: false },
    stageAllSignedUpdated: { type: Boolean, default: false },
    signedDocCreated: { type: Boolean, default: false },
  },
  { _id: false }
);

const ContractSchema = new mongoose.Schema({
  contractType: { type: String, required: true },
  downloadUrl: { type: String, default: "" },
});

const FolderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // RabbitSign folderId

    tenantId: { type: String, ref: "Tenant", required: true },

    opportunityId: { type: String, required: true },

    sellerEmail: { type: String },
    buyerEmail: { type: String },

    status: { type: String, default: "sent" },

    stageHistory: { type: [StageHistorySchema], default: [] },

    flags: { type: FlagsSchema, default: () => ({}) },
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
