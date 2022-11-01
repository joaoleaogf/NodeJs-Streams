import { Schema } from 'mongoose';

// Create the schema
export const fileSchema = new Schema({
  length: { type: Number },
  chunkSize: { type: Number },
  uploadDate: { type: Date },
  filename: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, {
  versionKey: false,
  timestamps: true,
})
  .index({ filename: 1 });