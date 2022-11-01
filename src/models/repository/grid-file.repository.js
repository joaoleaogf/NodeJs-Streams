import { mongo } from 'mongoose';

export class GridFileRepository {

    connection;

    bucket;

    gridFile;

    connection;

    chunkSizeBytes = 255;

    constructor(connectionInstance, gridFileConnection) {
        this.connection = connectionInstance;

        this.gridFile = gridFileConnection;
    }

    async getBucket() {
        if (!this.bucket) {

            this.bucket = new mongo.GridFSBucket(this.connection, {
                bucketName: `${this.gridFile.collection.collectionName}-files`
            })
        }

        return this.bucket
    }

    async findOneById(id) {
        return this.gridFile.findOne({ _id: id });
    }

    async removeById(id) {
        const doc = await this.gridFile.findOneById(id);

        if (doc) {
            await this.getBucket().delete(doc._id);
        }

        return doc;
    }

    async removeByIds(ids) {
        const docs = await this.gridFile.find({ _id: { $in: ids } });

        if (docs) {
            await this.getBucket().deleteMany({ _id: { $in: ids } });
        }

        return docs;
    }

    async create(chunk) {
        return this.gridFile.create(chunk);
    }

    async createMany(chunks) {
        return this.gridFile.insertMany(chunks);
    }

    async getUploadStream(filename, id) {
        const bucket = this.getBucket();

        return bucket.openUploadStreamWithId(id, filename, {
            chunkSizeBytes: this.chunkSizeBytes
        });
    }

    async getDownloadStream(id) {
        const bucket = this.getBucket();

        return bucket.openDownloadStream(id);
    }

    async uploadStream(stream, id, filename) {
        const uploadStream = this.getUploadStream(id, filename);

        stream.pipe(uploadStream);

        return uploadStream;
    }

    async downloadStream(stream, id) {
        const downloadStream = this.getDownloadStream(id);

        downloadStream.pipe(stream);
    }

    async upload(stream, callback, id, filename) {
        return new Promise((resolve, reject) => {
            const uploadStream = this.uploadStream(stream, id, filename)

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
            const downloadStream = this.downloadStream(stream, id)

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