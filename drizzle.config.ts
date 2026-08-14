import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost) {
  console.warn("SQL_HOST must be set in environment variables. Falling back to default URL for type checking only.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: sqlHost && user && password && sqlDbName ? {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    ssl: false,
  } : {
    url: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db",
  },
});
