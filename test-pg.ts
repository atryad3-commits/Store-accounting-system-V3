import { config } from 'dotenv';
config();
import { Pool } from 'pg';
async function test() {
  console.log('DATABASE_URL=', process.env.DATABASE_URL);
}
test();
