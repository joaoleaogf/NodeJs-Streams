import mongoose from "mongoose";

export class FileStreamer {

    constructor(connection) {
        this.connection = connection;
    }

    async getFile(id) {
        const file = await this.connection.FILE.findOne({ _id: id });

    }


    /* getFileStream(fileKey) {
 
        const start = Number(range.replace(/\D/g, ""));
 
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
 
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
 
 
    } */

    uploadFile(file) {
        const bucket = new mongoose.mongo.GridFSBucket(this.connection, {
            bucketName: `${this.connection.CHUNK.collection.collectionName}-files`
        });

        const uploadStream = bucket.openUploadStream(file.name);
        const id = uploadStream.id;

        uploadStream.write(file.data);
        uploadStream.end();

        return id;
    }

}