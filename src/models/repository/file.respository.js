
export class FileRepository {
    constructor(fileConnection, chunkConnection) {
        this.file = fileConnection;
        this.chunk = chunkConnection;
    }

    async findOneById(id) {
        return this.file.findOne({ _id: id });
    }

    async removeById(id) {

        if (doc) {
        }

        return doc;
    }

    async create(file) {
    }
}