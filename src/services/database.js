import * as mongoose from 'mongoose';
import { pass, user, host } from '../config/database/database.js';
import { chunkSchema } from '../models/schemas/chunk-schema.js';
import { fileSchema } from '../models/schemas/file-schema.js';
import { LogSchema } from '../models/schemas/log-schema.js';
import { LoggerService } from './logger.js';


export class DatabaseService {

    constructor() {
        this.mongooseConection();

        this.loggerService = new LoggerService('DatabaseService', this.LOGGER);

        this.loggerService.info('DatabaseService initialized');
    }

    async mongooseConection() {
        const dbUrl = `mongodb://${user}:${pass}@${host}`

        console.log('\x1b[3m\x1b[34m%s\x1b[0m', `Database URL: ${dbUrl}`);
        console.log('\n\x1b[47m\x1b[1m\x1b[34m%s\x1b[0m', 'Connecting to database...');

        this.connection = mongoose.createConnection(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .on('error', (err) => console.log('\n\x1b[31m%s\x1b[0m', `Error connecting to database: ${err}`))
            .on('connected', () => console.log('\n\x1b[32m%s\x1b[0m', `connected to db`))
            .on('disconnected', () => console.log('\n\x1b[32m%s\x1b[0m', 'disconnected from db'));

        this.FILE = this.connection.model('GridFile', fileSchema);
        this.CHUNK = this.connection.model('GridFSBucket', chunkSchema);
        this.LOGGER = this.connection.model('Log', LogSchema);
    }
}
