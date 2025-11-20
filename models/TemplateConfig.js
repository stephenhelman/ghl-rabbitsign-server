//mapping of template ids for contracts

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SenderFieldMapSchema = new Schema(
  {
    fieldId: { type: String, required: true },
    source: { type: String, required: true }, // e.g. "seller.fullName"
    format: { type: String }, // "currency", "date", etc.
  },
  { _id: false }
);

const SignerSchema = new Schema(
  {
    role: { type: String, required: true }, // "seller", "buyer", etc.
    emailSource: { type: String, required: true }, // e.g. "seller.email"
    nameSource: { type: String, required: true }, // e.g. "seller.fullName"
  },
  { _id: false }
);

const TemplateConfigSchema = new Schema(
  {
    tenantId: { type: String, ref: "Tenant", required: true },

    contractType: { type: String, required: true },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },

    rabbitTemplateId: { type: String, required: true },
    displayName: { type: String },

    titleTemplate: { type: String },

    senderFieldMap: { type: [SenderFieldMapSchema], default: [] },
    signers: { type: [SignerSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "templateConfigs",
  }
);

TemplateConfigSchema.index(
  { tenantId: 1, contractType: 1, isActive: 1 },
  { unique: false }
);

export const TemplateConfig = mongoose.model(
  "TemplateConfig",
  TemplateConfigSchema
);
