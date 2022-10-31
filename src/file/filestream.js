import mongoose from "mongoose";
import { CONNECTION } from "../main";

async function getFileStream(fileKey) {

    const videoPath = "Chris-Do.mp4";

    const videoSize = fs.statSync("Chris-Do.mp4").size;

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

async function getFileFromDb(fileKey) {
    const bucket = new mongoose.mongo.GridFSBucket(CONNECTION, {
        bucketName: "videos",
    });

    const downloadStream = bucket.openDownloadStreamByName(fileKey);

    return downloadStream;
}