
export class FileRepository {
    constructor(connection) {
        this.connection = connection;
        this.file = this.connection.FILE;
        this.chunk = this.connection.CHUNK;
    }

    async findOneById(id) {
        return this.file.findOne({ _id: id });
    }

    async removeById(id) {
        const doc = await this.file.findOneById(id);

        if (doc) {
            await this.chunk.deleteMany(doc.chunks);
            await this.file.delete(id);
        }

        return doc;
    }

    async create(file) {
        return this.file.create(file);
    }
}