import * as mongoose from 'mongoose';
import * as fileSchema from '../models/schemas/file-schema.js';
import { pass, user, host } from '../config/database/database.js';

export class DatabaseService {

    DB_URL = `mongodb://${user}:${pass}@${host}`

    connection;

    FILE;

    async mongooseConection() {
        console.log('\x1b[3m\x1b[34m%s\x1b[0m', `Database URL: ${this.DB_URL}`);
        console.log('\n\x1b[47m\x1b[1m\x1b[34m%s\x1b[0m', 'Connecting to database...');

        this.connection = mongoose.createConnection(this.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .on('error', (err) => console.log('\n\x1b[31m%s\x1b[0m', `Error connecting to database: ${err}`))
            .on('connected', () => console.log('\n\x1b[32m%s\x1b[0m', `connected to db`))
            .on('disconnected', () => console.log('\n\x1b[32m%s\x1b[0m', 'disconnected from db'));

        this.FILE = this.connection.model('GridFile', fileSchema.fileSchema);
    }
}
