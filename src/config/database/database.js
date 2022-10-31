import * as dotEnv from 'dotenv';

dotEnv.config();

export const host = process.env.DB_URL;
export const user = process.env.DB_USERNAME;
export const pass = process.env.DB_PASSWORD;