import http from 'node:http';
import { DatabaseService } from './services/database.js';

export class Main {

    connection;

    constructor() {
        this.handler = new Handler();
        this.server = http.createServer(this.handler.handleRequest);
    }

    start() {
        const port = process.env.PORT || 3000;

        this.server.listen(port)
            .on('listening', () => console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', `server listening on port ${port}`));
    }

    initDatabaseConnection() {
        this.connection = new DatabaseService()
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

const main = new Main();
main.start();
main.initDatabaseConnection();
