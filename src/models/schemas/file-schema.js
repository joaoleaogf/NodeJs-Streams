import { Schema } from 'mongoose';

// Create the schema
export const fileSchema = new Schema({
  length: { type: Number },
  chunkSize: { type: Number },
  uploadDate: { type: Date },
  md5: { type: String },
  filename: { type: String },
  contentType: { type: String },
  metadata: { type: Schema.Types.Mixed },
  aliases: [{ type: String }]
}, {
  versionKey: false,
  collection: 'fs.files'
});

// Schema custom types

// Making an alias for the uploadDate property
fileSchema.virtual('createdAt').get(function () { return this.uploadDate })

// Schema contructor 
fileSchema.virtual('model').get(function () { return this.constructor })

fileSchema.virtual('chunkSizeBytes')

fileSchema.static('getBucket', function () {
  if (!this.bucket) {
    const connection = this.db

    this.bucket = new mongo.GridFSBucket(connection.db, {
      bucketName: this.collection.collectionName.replace('.files', '')
    })
  }

  return this.bucket
})

fileSchema.static('findOneAndDelete', async function (query) {
  const doc = await this.findOne(query)

  if (doc) await this.getBucket().delete(doc._id)

  return doc
})

fileSchema.static(`findByIdAndDelete`, function (id) {
  return this.findOneAndDelete({ _id: id })
})


fileSchema.method('getUploadStream', function () {
  const bucket = this.model.getBucket()

  // mongoose generates an id
  return bucket.openUploadStreamWithId(this._id, this.filename, {
    chunkSizeBytes: this.chunkSizeBytes,
    metadata: this.metadata,
    contentType: this.contentType,
    aliases: this.aliases
  })
})


fileSchema.method('getDownloadStream', function () {
  const bucket = this.model.getBucket()

  return bucket.openDownloadStream(this._id)
})


fileSchema.method('uploadStream', function (stream) {
  const uploadStream = this.getUploadStream()

  stream.pipe(uploadStream)

  return uploadStream
})


fileSchema.method('downloadStream', function (stream) {
  const downloadStream = this.getDownloadStream()

  downloadStream.pipe(stream)

  return downloadStream
})


fileSchema.method('upload', function (stream, callback) {
  return new Promise((resolve, reject) => {
    const uploadStream = this.uploadStream(stream)

    uploadStream.on('error', (error) => {
      reject(error)
      if (callback) callback(error)
    })

    uploadStream.on('finish', (file) => {
      const document = this.model.hydrate(file)

      resolve(document)
      if (callback) callback(null, document)
    })
  })
})

fileSchema.method('download', function (stream, callback) {
  return new Promise((resolve, reject) => {
    this.downloadStream(stream)

    stream.on('error', (error) => {
      reject(error)
      if (callback) callback(error)
    })

    stream.on('finish', () => {
      resolve()
      if (callback) callback()
    })
  })
})