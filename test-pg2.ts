import { config } from 'dotenv';
config();
console.log(process.env.SQL_HOST, process.env.PG_HOST);
