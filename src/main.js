import http from 'node:http';
import { DatabaseService } from './database/database.js'
import { GridFileRepository } from './database/repository/file-repository.js';


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
 
http.createServer(handler)
    .listen(port)
    .on('listening', () => console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', `server listening on port ${port}`))