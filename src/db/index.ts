import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db",
});

export const db = drizzle(pool, { schema });
