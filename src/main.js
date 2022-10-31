import http from 'node:http';
import { DatabaseService } from './services/database.js'
import { GridFileRepository } from './models/repository/file-repository.js';


function handler(req, res) {
    const { pathname } = new URL(req.url, 'http://localhost:3000');
    const { method } = req;


    if (pathname === '/video' && method === 'GET') {
        const { range } = req.headers;

        if (!range) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Requires Range header');
        }


    }
}

const port = process.env.PORT || 3000;

export const CONNECTION = new DatabaseService();
CONNECTION.mongooseConection();

const repository = new GridFileRepository(CONNECTION.FILE);


export class Main {
    constructor() {
        this.handler = new ServerHandler();
        this.server = http.createServer(handler);
    }

    start() {
        this.server.listen(port)
            .on('listening', () => console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', `server listening on port ${port}`));
    }

    initDatabaseConnection() {
        CONNECTION.mongooseConection();
    }

    stop() {
        this.server.close();
    }
}

export class Handler {
    requestHandler(req, res) {
        const { pathname } = new URL(req.url, 'http://localhost:3000');
        const { method } = req;

        if (pathname === '/video' && method === 'GET') {
            const { range } = req.headers;

            if (!range) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Requires Range header');
            }
        }
    }
}