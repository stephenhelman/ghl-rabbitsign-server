//entry for a kv, temporary.
//hosts all info that used to be stored in KV
//used to interact with rabbitsign and ghl
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StageHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const PropertySchema = new Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  { _id: false }
);

const FlagsSchema = new Schema(
  {
    stageSignedUpdated: { type: Boolean, default: false },
    stageAllSignedUpdated: { type: Boolean, default: false },
    signedDocCreated: { type: Boolean, default: false },
  },
  { _id: false }
);

const FolderSchema = new Schema(
  {
    _id: { type: String, required: true }, // RabbitSign folderId

    tenantId: { type: String, ref: "Tenant", required: true },

    contractType: { type: String, required: true },
    opportunityId: { type: String, required: true },

    propertyAddress: { type: String },
    property: { type: PropertySchema, default: {} },

    sellerContactId: { type: String },
    buyerContactId: { type: String },

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

export const Folder = mongoose.model("Folder", FolderSchema);
