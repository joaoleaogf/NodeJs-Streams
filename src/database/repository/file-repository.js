import * as mongoose from 'mongoose';
import { mongo } from 'mongoose';

export class GridFileRepository {

    connection;

    bucket;

    gridFile;

    connection;

    constructor(connectionInstance) {
        this.connection = connectionInstance;
    }

    async getBucket() {
        if (!this.bucket) {

            this.bucket = new mongo.GridFSBucket(this.connection, {
                bucketName: this.gridFile.collection.collectionName.replace('.files', '')
            })
        }

        return this.bucket
    }

    async findOneAndDelete(query) {
        const doc = await this.connection.findOne(query)

        if (doc) await this.getBucket().delete(doc._id)

        return doc
    }

    async getUploadStream() {
        const bucket = this.getBucket();

        // mongoose generates an id
        return bucket.openUploadStreamWithId(this._id, this.filename, {
            chunkSizeBytes: this.chunkSizeBytes,
            metadata: this.metadata,
            contentType: this.contentType,
            aliases: this.aliases
        });
    }

    async getDownloadStream(id) {
        const bucket = this.getBucket();

        return bucket.openDownloadStream(id);
    }

    async uploadStream(stream) {
        const uploadStream = this.getUploadStream();

        stream.pipe(uploadStream);

        return uploadStream;
    }

    async downloadStream(stream) {
        const downloadStream = this.getDownloadStream();

        downloadStream.pipe(stream);
    }

    async upload(stream, callback) {
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
    }

    async download(id, stream, callback) {
        return new Promise((resolve, reject) => {
            const downloadStream = this.downloadStream(stream)

            downloadStream.on('error', (error) => {
                reject(error)
                if (callback) callback(error)
            })

            downloadStream.on('finish', () => {
                resolve()
                if (callback) callback()
            })
        })
    }

}