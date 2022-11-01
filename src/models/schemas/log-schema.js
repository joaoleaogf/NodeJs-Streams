import { Schema } from "mongoose";

export const LogSchema = new Schema({
    log: { type: String, required: true },
    level: { type: String },
    method: { type: String },
    description: { type: String },
    statusCode: { type: Number },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    url: { type: String },
    userAgent: { type: String },
    message: { type: String }
})
    .index({ timestamp: 1 });