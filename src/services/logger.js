import { Logger } from 'mongodb';

Logger.setLevel('info');

export class LoggerService {
    constructor(name, connection) {
        this.name = name;
        this.connection = connection;
    }

    async log(level, message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.connection.create({
            log: this.name, message, level, method, description, statusCode, timestamp, ip, url, userAgent
        })
    }

    async info(message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.log('info', message, method, description, statusCode, timestamp, ip, url, userAgent)
    }

    async debug(message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.log('debug', message, method, description, statusCode, timestamp, ip, url, userAgent)
    }

    async trace(message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.log('trace', message, method, description, statusCode, timestamp, ip, url, userAgent)
    }

    async warn(message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.log('warn', message, method, description, statusCode, timestamp, ip, url, userAgent)
    }

    async error(message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.log('error', message, method, description, statusCode, timestamp, ip, url, userAgent)
    }

    async fatal(message, method, description, statusCode, timestamp, ip, url, userAgent) {
        await this.log('fatal', message, method, description, statusCode, timestamp, ip, url, userAgent)
    }
}