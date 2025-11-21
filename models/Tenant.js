//configuration for client using the worker and api
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EncryptedFieldSchema = new Schema(
  {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
  },
  { _id: false }
);

const TenantSchema = new Schema(
  {
    _id: { type: String, required: true }, // tenantId
    name: { type: String, required: true },

    ghlLocationId: { type: String, required: true },

    ghlApiKey: { type: EncryptedFieldSchema, required: true },
    rabbitSecretKey: { type: EncryptedFieldSchema, required: true },
    rabbitKeyId: { type: EncryptedFieldSchema, required: true },

    defaultPipelineId: { type: String },
    stageIds: {
      contractSent: { type: String },
      sellerSigned: { type: String },
      fullySigned: { type: String },
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    collection: "tenants",
  }
);

const Tenant = mongoose.model("Tenant", TenantSchema);

module.exports = { Tenant };
