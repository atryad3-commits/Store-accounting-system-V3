const schemaContent = `import { pgTable, serial, text, varchar, timestamp, json, integer, boolean, numeric } from "drizzle-orm/pg-core";

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

// --- Domain Tables ---

export const products = pgTable('products', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }),
  type: varchar('type', { length: 50 }).default('product'), // product, service, raw_material
  barcode: varchar('barcode', { length: 255 }),
  categoryId: varchar('category_id', { length: 50 }),
  buyPrice: numeric('buy_price'),
  sellPrice: numeric('sell_price'),
  wholesalePrice: numeric('wholesale_price'),
  stock: numeric('stock').default('0'),
  unit: varchar('unit', { length: 50 }),
  status: varchar('status', { length: 50 }).default('active'),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const productCategories = pgTable('product_categories', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: varchar('parent_id', { length: 50 }),
});

export const persons = pgTable('persons', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }),
  phone: varchar('phone', { length: 50 }),
  economicCode: varchar('economic_code', { length: 50 }),
  nationalId: varchar('national_id', { length: 50 }),
  balance: numeric('balance').default('0'),
  status: varchar('status', { length: 50 }).default('active'),
  address: text('address'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: varchar('id', { length: 50 }).primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // sell, buy, return_sell, return_buy, waste
  date: varchar('date', { length: 50 }).notNull(),
  personId: varchar('person_id', { length: 50 }),
  warehouseId: varchar('warehouse_id', { length: 50 }),
  totalAmount: numeric('total_amount').default('0'),
  discount: numeric('discount').default('0'),
  tax: numeric('tax').default('0'),
  payableAmount: numeric('payable_amount').default('0'),
  paidAmount: numeric('paid_amount').default('0'),
  status: varchar('status', { length: 50 }).default('draft'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const invoiceItems = pgTable('invoice_items', {
  id: varchar('id', { length: 50 }).primaryKey(),
  invoiceId: varchar('invoice_id', { length: 50 }).notNull(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  quantity: numeric('quantity').notNull(),
  unitPrice: numeric('unit_price').notNull(),
  totalPrice: numeric('total_price').notNull(),
  discount: numeric('discount').default('0'),
  tax: numeric('tax').default('0'),
  netPrice: numeric('net_price').notNull(),
});

export const transactions = pgTable('transactions', {
  id: varchar('id', { length: 50 }).primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // receive, pay, transfer
  amount: numeric('amount').notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  sourceAccountId: varchar('source_account_id', { length: 50 }),
  destinationAccountId: varchar('destination_account_id', { length: 50 }),
  personId: varchar('person_id', { length: 50 }),
  invoiceId: varchar('invoice_id', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 50 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 50 }),
  bankName: varchar('bank_name', { length: 255 }),
  balance: numeric('balance').default('0'),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cashboxes = pgTable('cashboxes', {
  id: varchar('id', { length: 50 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  balance: numeric('balance').default('0'),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const warehouses = pgTable('warehouses', {
  id: varchar('id', { length: 50 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  manager: varchar('manager', { length: 255 }),
  address: text('address'),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const warehouseStocks = pgTable('warehouse_stocks', {
  id: varchar('id', { length: 50 }).primaryKey(),
  warehouseId: varchar('warehouse_id', { length: 50 }).notNull(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  stock: numeric('stock').default('0'),
});
`;

const fs = require('fs');
fs.writeFileSync('src/db/schema.ts', schemaContent);
console.log('Schema written');
