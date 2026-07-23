import { pgTable, serial, text, varchar, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";

// Core Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Settings Table
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  settings: json('settings'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Legacy Key-Value table for backwards compatibility
export const legacyStore = pgTable('store', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: text('value').notNull(),
});
