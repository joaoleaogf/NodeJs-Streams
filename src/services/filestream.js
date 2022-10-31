import mongoose from "mongoose";
import { CONNECTION } from "../main";

export class FileStreamer {

    connection;
    bucketName;

    constructor(connection, bucketName) {
        this.connection = connection;
        this.bucketName = bucketName;
    }

    getFileStream(fileKey, path) {
        const key = `${path}/${fileKey}`;
        const videoSize = fs.statSync(key).size;

        const CHUNK_SIZE = 10 ** 6 * 2; // 1MB
        const start = Number(range.replace(/\D/g, ""));

        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };


    }

    getFileStream(fileKey) {
        const { bucketName } = this;

        const bucket = new mongoose.mongo.GridFSBucket(CONNECTION, {
            bucketName
        });

        return bucket.openDownloadStreamByName(fileKey);
    }

}