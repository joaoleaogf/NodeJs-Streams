import { Schema, model } from 'mongoose'

const chunkSchema = new Schema({
    "_id": { type: Schema.Types.ObjectId, required: true },
    "files_id": { type: Schema.Types.ObjectId, required: true },
    "n": { type: Number, required: true },
    "data": { type: Schema.Types.Buffer, required: true },
})

module.exports = model("Chunk", chunkSchema);