import 'dotenv/config';
import express from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
const storeContext = new AsyncLocalStorage<string>();

import path from 'path';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import fsPromises from 'fs/promises';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Client, Pool } from 'pg';
import cookieParser from 'cookie-parser';

const DATA_FILE = path.join(process.cwd(), 'database.json');
const SQLITE_FILE = path.join(process.cwd(), 'database.sqlite');

const dbs: Record<string, any> = {};
function getDb() {
  const storeId = storeContext.getStore() || 'default';
  if (!dbs[storeId]) {
    const dbFile = storeId === 'default' ? SQLITE_FILE : path.join(process.cwd(), `database_${storeId}.sqlite`);
    dbs[storeId] = new DatabaseSync(dbFile);
    dbs[storeId].exec(`
      CREATE TABLE IF NOT EXISTS store (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
  }
  return dbs[storeId];
}
let pgPool: any = null;
let usePg = false;
const DB_CONFIG_FILE = path.join(process.cwd(), 'db_config.json');

const KNOWN_TABLES = [
  'users', 'company_profile', 'financial_years', 'person_groups', 'person_roles',
  'payslips', 'debtors_trackings',
  'accounts', 'cashboxes', 'warehouses', 'product_categories', 'products',
  'transactions', 'invoices', 'accounting_documents', 'checkbooks', 'invoice_items', 'accounting_document_items', 'stocktaking_items',
  'warehouse_stocks', 'stocktakings', 'person_follow_ups', 'loans',
  'ledger_accounts', 'installments', 'sms_messages', 'person_opening_balances', 'product_price_history', 'sales_invoice_payments', 'purchase_invoice_payments',
  'issued_checks', 'received_checks', 'check_history',
  'persons', 'person_contacts', 'person_bank_accounts', 'system_logs', 'database_logs', 'backupConfig',
  'purchase_invoices', 'purchase_invoice_items',
  'sales_invoices', 'sales_invoice_items',
  'warehouse_receipts', 'warehouse_receipt_items',
  'warehouse_remittances', 'warehouse_remittance_items',
  'proforma_invoices', 'proforma_invoice_items',
  'sale_returns', 'sale_return_items',
  'purchase_returns', 'purchase_return_items',
  'wastes', 'waste_items',
  'receipt_transactions', 'payment_transactions',
  'issued_checks', 'received_checks', 'payslips'
, 'InventoryTransactions', 'personal_notes'];


const tableSchemas = new Map<string, Set<string>>();

async function syncTableSchema(client: any, tableName: string, dataObj: any) {
    if (!dataObj || typeof dataObj !== 'object') return;
    let knownCols = tableSchemas.get(tableName);
    if (!knownCols) {
        knownCols = new Set();
        try {
            const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', [tableName]);
            for (const row of res.rows) knownCols.add(row.column_name);
        } catch (e) {}
        tableSchemas.set(tableName, knownCols);
    }
    
    for (const [k, v] of Object.entries(dataObj)) {
        if (v === undefined) continue;
        if (!knownCols.has(k)) {
            let colType = 'TEXT';
            if (v === null) colType = 'TEXT';
            else if (typeof v === 'number') colType = 'DOUBLE PRECISION';
            else if (typeof v === 'boolean') colType = 'BOOLEAN';
            else if (typeof v === 'object') colType = 'JSONB';
            
            try {
               console.log(`Adding column ${k} to ${tableName}`); await client.query(`ALTER TABLE "${tableName}" ADD COLUMN "${k}" ${colType}`);
               knownCols.add(k);
            } catch (e) {
               console.error(`Error adding column ${k} to ${tableName}`, e.message);
            }
        }
    }
}

async function connectPgDb(connectionString: string) {
    try {
        const pool = new Pool({ connectionString });
        await pool.query('SELECT 1');
        return pool;
    } catch (e: any) {
        if (e.code === '3D000') { // database does not exist
            const url = new URL(connectionString);
            const dbName = url.pathname.slice(1);
            url.pathname = '/postgres';
            const rootClient = new Client({ connectionString: url.toString() });
            await rootClient.connect();
            await rootClient.query(`CREATE DATABASE "${dbName}"`);
            await rootClient.end();
            
            const pool = new Pool({ connectionString });
            await pool.query('SELECT 1');
            return pool;
        }
        throw e;
    }
}


async function innerGetDbData(key: string) {
  if (usePg && pgPool) {
    if (!KNOWN_TABLES.includes(key)) return null;
    try {
      const res = await pgPool.query(`SELECT * FROM "${key}"`);
      
      const parseJSONFields = (row: any) => {
         if (!row) return row;
         for (const k in row) {
            if (typeof row[k] === 'string' && (row[k].startsWith('{') || row[k].startsWith('['))) {
               try {
                  row[k] = JSON.parse(row[k]);
               } catch(e) {}
            }
         }
         return row;
      };

      if (key === 'company_profile') {
        try {
           await pgPool.query(`CREATE TABLE IF NOT EXISTS system_settings (setting_key VARCHAR PRIMARY KEY, setting_value TEXT)`);
           const cres = await pgPool.query(`SELECT * FROM system_settings`);
           if (cres.rows.length === 0) return null;
           const obj = { id: 'singleton' };
           for (const r of cres.rows) {
              try { obj[r.setting_key] = JSON.parse(r.setting_value); }
              catch(e) { obj[r.setting_key] = r.setting_value; }
           }
           return obj;
        } catch(e) { return null; }
      }
      if (key === 'backupConfig') {
        return res.rows.length > 0 ? parseJSONFields(res.rows[0]) : null;
      }
      return res.rows.map(parseJSONFields);
    } catch (e: any) {
      if (e.code === '42P01') { // table does not exist
        return (key === 'company_profile' || key === 'backupConfig') ? null : [];
      }
      throw e;
    }
  } else {
    if (key === 'company_profile') {
        try {
            getDb().prepare('CREATE TABLE IF NOT EXISTS system_settings (setting_key TEXT PRIMARY KEY, setting_value TEXT)').run();
            const rows = getDb().prepare('SELECT setting_key, setting_value FROM system_settings').all();
            if (rows.length === 0) {
               const oldRow = getDb().prepare('SELECT value FROM store WHERE key = ?').get('company_profile') as any;
               return oldRow ? JSON.parse(oldRow.value) : null;
            }
            const obj = { id: 'singleton' };
            for (const r of rows) {
                try { obj[r.setting_key] = JSON.parse(r.setting_value); }
                catch(e) { obj[r.setting_key] = r.setting_value; }
            }
            return obj;
        } catch(e) { return null; }
    }
    const row = getDb().prepare('SELECT value FROM store WHERE key = ?').get(key) as any;
    return row ? JSON.parse(row.value) : null;
  }
}

async function innerSetDbData(key: string, data: any) {
  if (usePg && pgPool) {
    if (!KNOWN_TABLES.includes(key)) return;
    const client = await pgPool.connect();
    try {
       await client.query('BEGIN');
       if (key === 'company_profile') {
           await client.query(`CREATE TABLE IF NOT EXISTS system_settings (setting_key VARCHAR PRIMARY KEY, setting_value TEXT)`);
           if (data && typeof data === 'object') {
               const keys = Object.keys(data);
               for (const k of keys) {
                   if (k === 'id') continue;
                   let v = data[k];
                   const valStr = (v !== null && typeof v === 'object') ? JSON.stringify(v) : String(v);
                   await client.query(`INSERT INTO system_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT(setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value`, [k, valStr]);
               }
           }
       } else {
           await client.query(`CREATE TABLE IF NOT EXISTS "${key}" (id VARCHAR PRIMARY KEY)`);
           await client.query(`TRUNCATE TABLE "${key}"`);
           if (key === 'backupConfig' || !Array.isArray(data)) {
                if (data && typeof data === 'object') {
                    data.id = 'singleton';
                    await syncTableSchema(client, key, data);
                    const keys = Object.keys(data);
                    const vals = Object.values(data).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                    const colNames = keys.map(k => `"${k}"`).join(', ');
                    await client.query(`INSERT INTO "${key}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, vals);
                }
             } else {
                for (const item of data) {
                   if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
                   await syncTableSchema(client, key, item);
                   const keys = Object.keys(item);
                   const vals = Object.values(item).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                   const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                   const colNames = keys.map(k => `"${k}"`).join(', ');
                   await client.query(`INSERT INTO "${key}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, vals);
                }
             }
       }
       await client.query('COMMIT');
    } catch (err: any) {
       await client.query('ROLLBACK');
       tableSchemas.delete(key);
       console.log("Error in query:", err.message); throw err;
    } finally {
       client.release();
    }
  } else {
    if (key === 'company_profile') {
        getDb().prepare('CREATE TABLE IF NOT EXISTS system_settings (setting_key TEXT PRIMARY KEY, setting_value TEXT)').run();
        if (data && typeof data === 'object') {
            const stmt = getDb().prepare('INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value');
            const keys = Object.keys(data);
            for (const k of keys) {
                if (k === 'id') continue;
                let v = data[k];
                const valStr = (v !== null && typeof v === 'object') ? JSON.stringify(v) : String(v);
                stmt.run(k, valStr);
            }
        }
    } else {
        const value = JSON.stringify(data);
        getDb().prepare('INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value);
    }
  }
}

async function handleRelations(key: string, data: any) {
    if ((key === "invoices" || key === "sales_invoices" || key === "purchase_invoices" || key === "warehouse_receipts" || key === "warehouse_remittances" || key === "proforma_invoices" || key === "sale_returns" || key === "purchase_returns" || key === "wastes") && data && data.items) {
       const childTable = key === "invoices" ? "invoice_items" : (key.endsWith('s') ? key.substring(0, key.length - 1) + "_items" : key + "_items");
       const items = data.items.map((it: any) => ({...it, invoiceId: data.id, id: it.id || Math.random().toString(36).substring(2,15)}));
       delete data.items;
       return { strippedData: data, childTable, items };
    }
    if (key === "accounting_documents" && data && data.items) {
       const items = data.items.map((it: any) => ({...it, documentId: data.id, id: it.id || Math.random().toString(36).substring(2,15)}));
       delete data.items;
       return { strippedData: data, childTable: "accounting_document_items", items };
    }
    if (key === "stocktakings" && data && data.items) {
       const items = data.items.map((it: any) => ({...it, stocktakingId: data.id, id: it.id || Math.random().toString(36).substring(2,15)}));
       delete data.items;
       return { strippedData: data, childTable: "stocktaking_items", items };
    }
    return { strippedData: data, childTable: null, items: [] };
}

async function getDbData(key: string) {
  let data = await innerGetDbData(key);
  if (!data) return data;
  
  if ((key === 'invoices' || key === 'sales_invoices' || key === 'purchase_invoices' || key === 'warehouse_receipts' || key === 'warehouse_remittances' || key === 'proforma_invoices' || key === 'sale_returns' || key === 'purchase_returns' || key === 'wastes') && Array.isArray(data)) {
      const childTable = key === "invoices" ? "invoice_items" : (key.endsWith('s') ? key.substring(0, key.length - 1) + "_items" : key + "_items");
      const items = await innerGetDbData(childTable) || [];
      data.forEach((inv: any) => {
          inv.items = items.filter((it: any) => String(it.invoiceId) === String(inv.id));
      });
  } else if (key === 'accounting_documents' && Array.isArray(data)) {
      const items = await innerGetDbData('accounting_document_items') || [];
      data.forEach((doc: any) => {
          doc.items = items.filter((it: any) => String(it.documentId) === String(doc.id));
      });
  } else if (key === 'stocktakings' && Array.isArray(data)) {
      const items = await innerGetDbData('stocktaking_items') || [];
      data.forEach((st: any) => {
          st.items = items.filter((it: any) => String(it.stocktakingId) === String(st.id));
      });
  }
  return data;
}

async function setDbData(key: string, data: any) {
  if ((key === 'invoices' || key === 'sales_invoices' || key === 'purchase_invoices' || key === 'warehouse_receipts' || key === 'warehouse_remittances' || key === 'proforma_invoices' || key === 'sale_returns' || key === 'purchase_returns' || key === 'wastes') && Array.isArray(data)) {
      const childTable = key === "invoices" ? "invoice_items" : (key.endsWith('s') ? key.substring(0, key.length - 1) + "_items" : key + "_items");
      let hasItemsKey = data.some((inv: any) => 'items' in inv);
      const items: any[] = [];
      const strippedData = data.map((inv: any) => {
          if (inv.items) {
              inv.items.forEach((it: any) => {
                  items.push({ ...it, invoiceId: inv.id, id: it.id || Math.random().toString(36).substring(2, 15) });
              });
          }
          const { items: _, ...rest } = inv;
          return rest;
      });
      if (hasItemsKey) await innerSetDbData(childTable, items);
      await innerSetDbData(key, strippedData);
      return;
  } else if (key === 'accounting_documents' && Array.isArray(data)) {
      let hasItemsKey = data.some((doc: any) => 'items' in doc);
      const items: any[] = [];
      const strippedData = data.map((doc: any) => {
          if (doc.items) {
              doc.items.forEach((it: any) => {
                  items.push({ ...it, documentId: doc.id, id: it.id || Math.random().toString(36).substring(2, 15) });
              });
          }
          const { items: _, ...rest } = doc;
          return rest;
      });
      if (hasItemsKey) await innerSetDbData('accounting_document_items', items);
      await innerSetDbData(key, strippedData);
      return;
  } else if (key === 'stocktakings' && Array.isArray(data)) {
      let hasItemsKey = data.some((st: any) => 'items' in st);
      const items: any[] = [];
      const strippedData = data.map((st: any) => {
          if (st.items) {
              st.items.forEach((it: any) => {
                  items.push({ ...it, stocktakingId: st.id, id: it.id || Math.random().toString(36).substring(2, 15) });
              });
          }
          const { items: _, ...rest } = st;
          return rest;
      });
      if (hasItemsKey) await innerSetDbData('stocktaking_items', items);
      await innerSetDbData(key, strippedData);
      return;
  }
  await innerSetDbData(key, data);
}

async function getAllDbData() {
  if (usePg && pgPool) {
    const allData = [];
    const parseJSONFields = (row: any) => {
       if (!row) return row;
       for (const k in row) {
          if (typeof row[k] === 'string' && (row[k].startsWith('{') || row[k].startsWith('['))) {
             try {
                row[k] = JSON.parse(row[k]);
             } catch(e) {}
          }
       }
       return row;
    };

    for (const key of KNOWN_TABLES) {
       const res = await pgPool.query(`SELECT * FROM "${key}"`);
       if (key === 'company_profile') {
         let cval = null;
         try {
            await pgPool.query(`CREATE TABLE IF NOT EXISTS system_settings (setting_key VARCHAR PRIMARY KEY, setting_value TEXT)`);
            const cres = await pgPool.query(`SELECT * FROM system_settings`);
            if (cres.rows.length > 0) {
               cval = { id: 'singleton' };
               for (const r of cres.rows) {
                  try { cval[r.setting_key] = JSON.parse(r.setting_value); }
                  catch(e) { cval[r.setting_key] = r.setting_value; }
               }
            }
         } catch(e) {}
         allData.push({ key, value: cval });
       } else if (key === 'backupConfig') {
         allData.push({ key, value: res.rows.length > 0 ? parseJSONFields(res.rows[0]) : null });
       } else {
         allData.push({ key, value: res.rows.map(parseJSONFields) });
       }
    }
    return allData;
  } else {
    const rows = getDb().prepare('SELECT key, value FROM store').all();
    return rows.map((r: any) => {
      try {
        return { key: r.key, value: JSON.parse(r.value) };
      } catch (e) {
        return { key: r.key, value: r.value };
      }
    });
  }
}

async function ensurePostgresTables() {
  if (usePg && pgPool) {
    try {
      await pgPool.query('GRANT ALL ON SCHEMA public TO public');
    } catch (e) {
      console.warn('Could not grant schema privileges:', e.message);
    }
    for (const key of KNOWN_TABLES) {
      try {
        await pgPool.query(`
          CREATE TABLE IF NOT EXISTS "${key}" (id VARCHAR PRIMARY KEY)
        `);
      } catch (err: any) {
        console.error(`Error creating table ${key}:`, err.message);
      }
    }
  }
}

async function migrateSqliteToPostgres() {
  if (!usePg || !pgPool) return;
    try {
      const res = await pgPool.query(`SELECT COUNT(*) as count FROM "users"`);
      const hasSqliteData = getDb().prepare('SELECT count(*) as count FROM store').get() as any;
      if (parseInt(res.rows[0].count) === 0 && hasSqliteData && hasSqliteData.count > 0) {
        // Only migrate if Postgres has no users AND SQLite has data. To prevent accidental data wipe, we don't drop tables.
        console.log('Migrating from SQLite to Postgres...');
        tableSchemas.clear();
        const sqliteRows = getDb().prepare('SELECT key, value FROM store').all();
        for (const row of sqliteRows) {
          const key = row.key;
          if (KNOWN_TABLES.includes(key)) {
            const data = JSON.parse(row.value);
            if (key === 'company_profile' || key === 'backupConfig' || !Array.isArray(data)) {
               if (data && typeof data === 'object') {
                  data.id = 'singleton';
                  await syncTableSchema(pgPool, key, data);
                  const keys = Object.keys(data);
                  const vals = Object.values(data).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                  const colNames = keys.map(k => `"${k}"`).join(', ');
                  await pgPool.query(`INSERT INTO "${key}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO NOTHING`, vals);
               }
            } else {
               for (const item of data) {
                  if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
                  
                  let finalItem = { ...item };
                  let related = null;
                  if (['invoices', 'sales_invoices', 'purchase_invoices', 'warehouse_receipts', 'warehouse_remittances', 'proforma_invoices', 'sale_returns', 'purchase_returns', 'wastes', 'accounting_documents', 'stocktakings'].includes(key)) {
                     const rel = await handleRelations(key, finalItem);
                     finalItem = rel.strippedData;
                     related = rel;
                  }

                  await syncTableSchema(pgPool, key, finalItem);
                  const keys = Object.keys(finalItem);
                  const vals = Object.values(finalItem).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                  const colNames = keys.map(k => `"${k}"`).join(', ');
                  await pgPool.query(`INSERT INTO "${key}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO NOTHING`, vals);

                  if (related && related.childTable) {
                      for (const it of related.items) {
                          await syncTableSchema(pgPool, related.childTable, it);
                          const itKeys = Object.keys(it);
                          const itVals = Object.values(it).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                          const itPlaceholders = itKeys.map((_, idx) => `$${idx + 1}`).join(', ');
                          const itColNames = itKeys.map(k => `"${k}"`).join(', ');
                          await pgPool.query(`INSERT INTO "${related.childTable}" (${itColNames}) VALUES (${itPlaceholders}) ON CONFLICT(id) DO NOTHING`, itVals);
                      }
                  }
               }
            }
          }
        }
        console.log('Migration to Postgres complete');
      }
    } catch(e) { console.error('Migration error', e); }
}
async function initDB() {
  try {
    const configRaw = await fsPromises.readFile(DB_CONFIG_FILE, 'utf-8');
    const config = JSON.parse(configRaw);
    if (config.engine === 'postgres' && config.connectionString) {
      pgPool = await connectPgDb(config.connectionString);
      usePg = true;
      console.log('Connected to PostgreSQL');
    }
  } catch (e) {
    if (process.env.SQL_HOST && process.env.SQL_USER) {
      pgPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
      });
      await pgPool.query('SELECT 1');
      usePg = true;
      console.log('Connected to Cloud SQL PostgreSQL');
    } else if (process.env.DATABASE_URL) {
      pgPool = await connectPgDb(process.env.DATABASE_URL);
      usePg = true;
      console.log('Connected to PostgreSQL from env DATABASE_URL');
    }
  }


  getDb().exec(`
    CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  try {
    const raw = await fsPromises.readFile(DATA_FILE, 'utf-8');
    const legacyDB = JSON.parse(raw);
    const getStmt = getDb().prepare('SELECT key FROM store WHERE key = ?');
    const insertStmt = getDb().prepare('INSERT INTO store (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(legacyDB)) {
      if (!getStmt.get(key)) {
        insertStmt.run(key, JSON.stringify(value));
      }
    }
    await fsPromises.rename(DATA_FILE, DATA_FILE + '.bak');
    console.log('Migrated JSON DB to SQLite');
  } catch (e) {}

  if (usePg && pgPool) {
    await ensurePostgresTables();
    await migrateSqliteToPostgres();
  } else {
    try {
      const configExists = await fsPromises.access(DB_CONFIG_FILE).then(() => true).catch(() => false);
      if (!configExists) {
        const getStmt = getDb().prepare('SELECT value FROM store WHERE key = ?');
        const usersRow = getStmt.get('users') as any;
        const profileRow = getStmt.get('company_profile') as any;
        if (usersRow && profileRow) {
           const users = JSON.parse(usersRow.value);
           const profile = JSON.parse(profileRow.value);
           if (Array.isArray(users) && users.length > 0 && profile && profile.companyName) {
              console.log('Auto-detected existing SQLite configuration. Writing db_config.json...');
              const config = { engine: 'sqlite' };
              await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
           }
        }
      }
    } catch (e) {
      console.error('Error auto-detecting existing SQLite configuration:', e);
    }
  }
}

async function startServer() {
  await initDB();
  const app = express();
  const PORT = 3000;
  
  app.use(express.json({ limit: '50mb' }));
  app.use(express.text({ limit: '500mb', type: ['text/*', 'application/sql', 'application/json'] }));
  app.use(cookieParser());

  app.get('/api/databases', async (req, res) => {
    try {
      const files = await fsPromises.readdir(process.cwd());
      const dbs = files
        .filter(f => f.startsWith('database') && f.endsWith('.sqlite'))
        .map(f => {
          if (f === 'database.sqlite') return { id: 'default', name: 'فروشگاه اصلی' };
          const match = f.match(/^database_(.+)\.sqlite$/);
          if (match) return { id: match[1], name: decodeURIComponent(match[1]) };
          return null;
        })
        .filter(Boolean);
      res.json({ success: true, databases: dbs });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/databases', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });
      const id = encodeURIComponent(name.replace(/\s+/g, '_'));
      const dbFile = path.join(process.cwd(), `database_${id}.sqlite`);
      // It will be created on next getDb() call. Just initialize it:
      const newDb = new DatabaseSync(dbFile);
      newDb.exec(`
        CREATE TABLE IF NOT EXISTS store (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);
      res.json({ success: true, database: { id, name } });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.use((req, res, next) => {
    const storeId = req.headers['x-store-id'] || 'default';
    storeContext.run(storeId as string, () => {
      next();
    });
  });


  // === AUTHENTICATION & USERS === //
  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2024';
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-key-2024';

  const getUsers = async () => {
    return (await getDbData('users')) || [];
  };

  const saveUsers = async (users) => {
    await setDbData('users', users);
  };
  
  // Custom users endpoint intercepting password saves
  app.post('/api/data/users', async (req, res, next) => {
    try {
      const users = req.body;
      if (Array.isArray(users)) {
        for (const user of users) {
          if (user.password && !user.password.startsWith('$2b$')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
      req.body = users;
      next();
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await getUsers();
    
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است.' });
    if (!user.isActive) return res.status(403).json({ error: 'حساب کاربری غیرفعال است.' });
    
    let isMatch = false;
    if (user.password.startsWith('$2b$')) {
       isMatch = await bcrypt.compare(password, user.password);
    } else {
       isMatch = (password === user.password);
       if (isMatch) {
          user.password = await bcrypt.hash(password, 10);
          await saveUsers(users);
       }
    }
    
    if (!isMatch) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است.' });
    
    if (user.requires2FA) {
       const otp = Math.floor(100000 + Math.random() * 900000).toString();
       user.currentOTP = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 };
       await saveUsers(users);
       console.log('OTP for ' + username + ' is: ' + otp);
       
       const tempToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '5m' });
       return res.json({ requireOTP: true, tempToken, message: 'کد تایید ورود جهت تست (در کنسول هم چاپ شد): ' + otp }); 
    } else {
       return finalizeLogin(res, user);
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    const { tempToken, otp } = req.body;
    try {
      const decoded = jwt.verify(tempToken, JWT_SECRET);
      const users = await getUsers();
      const user = users.find(u => u.username === decoded.username);
      
      if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });
      if (!user.currentOTP || user.currentOTP.code !== otp || user.currentOTP.expiresAt < Date.now()) {
         return res.status(401).json({ error: 'کد ورود نامعتبر است یا منقضی شده است' });
      }
      
      delete user.currentOTP;
      await saveUsers(users);
      
      return finalizeLogin(res, user);
    } catch(err) {
      return res.status(401).json({ error: 'توکن نامعتبر است' });
    }
  });
  
  app.post('/api/auth/refresh', async (req, res) => {
     const token = req.cookies.refreshToken;
     if (!token) return res.status(401).json({ error: 'نیازمند ورود مجدد' });
     
     try {
       const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
       const users = await getUsers();
       const user = users.find(u => u.username === decoded.username);
       if (!user || user.tokenVersion !== decoded.tokenVersion) {
         return res.status(401).json({ error: 'توکن نامعتبر است' });
       }
       
       const accessToken = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
       res.json({ accessToken });
     } catch(e) {
       res.status(401).json({ error: 'توکن نامعتبر است' });
     }
  });
  
  app.post('/api/auth/logout', (req, res) => {
      res.clearCookie('refreshToken');
      res.json({ success: true });
  });
  
  function finalizeLogin(res, user) {
     const tokenVersion = user.tokenVersion || 1;
     const accessToken = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
     const refreshToken = jwt.sign({ username: user.username, tokenVersion }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
     
     res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/auth/refresh' });
     
     const userWithoutPwd = { ...user };
     delete userWithoutPwd.password;
     delete userWithoutPwd.currentOTP;
     res.json({ accessToken, user: userWithoutPwd });
  }
  // === END AUTHENTICATION === //

  // --- Local Backups Logic (Configurable) ---
  let backupConfig = { path: '', intervalHours: 4 };
  try {
     const backupData = await getDbData('backupConfig');
     if (backupData) {
        Object.assign(backupConfig, backupData);
     }
  } catch(e) {}

  const getBackupsDir = () => {
     return backupConfig.path && backupConfig.path.trim() !== '' 
        ? backupConfig.path 
        : path.join(process.cwd(), 'backups');
  };

  let backupInterval = null;
  const runBackupJob = async () => {
     try {
        const dir = getBackupsDir();
        await fsPromises.mkdir(dir, { recursive: true });
        const rows = await getAllDbData();
        const backupData = {};
        for (const row of rows) {
          backupData[row.key] = row.value;
        }
        const fileName = `backup-${Date.now()}.json`;
        await fsPromises.writeFile(path.join(dir, fileName), JSON.stringify(backupData));
        
        // keep only last 20 backups
        const files = await fsPromises.readdir(dir);
        const jsonFiles = files.filter(f => f.startsWith('backup-') && (f.endsWith('.json') || f.endsWith('.sql'))).sort((a,b) => b.localeCompare(a));
        if (jsonFiles.length > 20) {
           for (let i = 0; i < jsonFiles.length - 20; i++) {
              await fsPromises.unlink(path.join(dir, jsonFiles[i]));
           }
        }
     } catch (err) {
        console.error('Backup job failed', err);
     }
  };

  if (backupConfig.intervalHours > 0) {
     backupInterval = setInterval(runBackupJob, backupConfig.intervalHours * 60 * 60 * 1000);
  }

  app.post('/api/db/backup-config', async (req, res) => {
     backupConfig = { ...backupConfig, ...req.body };
     await setDbData('backupConfig', backupConfig);
     if (backupInterval) clearInterval(backupInterval);
     if (backupConfig.intervalHours > 0) {
        backupInterval = setInterval(runBackupJob, backupConfig.intervalHours * 60 * 60 * 1000);
     }
     res.json({ success: true, config: backupConfig });
  });

  app.get('/api/db/backup-config', (req, res) => {
      res.json(backupConfig);
  });

  app.post(['/api/db/run-backup', '/api/db/backups/do'], async (req, res) => {
      await runBackupJob();
      res.json({ success: true });
  });

  app.get('/api/db/backups', async (req, res) => {
     try {
        const dir = getBackupsDir();
        await fsPromises.mkdir(dir, { recursive: true });
        const files = await fsPromises.readdir(dir);
        const jsonFiles = files.filter(f => f.startsWith('backup-') && (f.endsWith('.json') || f.endsWith('.sql'))).sort((a,b) => b.localeCompare(a));
        const backupsList = [];
        for (const file of jsonFiles) {
           const stat = await fsPromises.stat(path.join(dir, file));
           backupsList.push({ file, size: stat.size, time: stat.mtimeMs });
        }
        res.json(backupsList);
     } catch(e) {
        res.status(500).json({ error: e.message });
     }
  });


  app.post('/api/db/backups/restore/:filename', async (req, res) => {
     try {
         const { filename } = req.params;
         const dir = getBackupsDir();
         const filePath = path.join(dir, filename);
         if (!filePath.startsWith(dir)) return res.status(403).send('Invalid path');
         
         if (filename.endsWith('.sql') && usePg && pgPool) {
             const fileContent = await fsPromises.readFile(filePath, 'utf-8');
             // Split by statements or just execute the whole block if memory allows. 
             // pgPool.query handles multiple statements separated by ';'
             await pgPool.query(fileContent);
         } else {
             const fileContent = await fsPromises.readFile(filePath, 'utf-8');
             const backupData = JSON.parse(fileContent);
             
             if (usePg && pgPool) {
               for (const key of KNOWN_TABLES) {
                 try {
                   await pgPool.query(`TRUNCATE TABLE "${key}" CASCADE`);
                 } catch (e) {}
               }
             } else {
               try { getDb().prepare('DELETE FROM store').run(); } catch(e) {}
             }

             for (const [key, value] of Object.entries(backupData)) {
                 if (KNOWN_TABLES.includes(key)) {
                    await setDbData(key, value);
                 }
             }
         }
         res.json({ success: true });
     } catch(e) {
         console.error('Restore specific backup error:', e);
         res.status(500).json({ success: false, error: e.message });
     }
  });

  app.delete('/api/db/backups/:filename', async (req, res) => {
      try {
         const { filename } = req.params;
         const dir = getBackupsDir();
         const filePath = path.join(dir, filename);
         if (!filePath.startsWith(dir)) return res.status(403).send('Invalid path');
         await fsPromises.unlink(filePath);
         res.json({ success: true });
      } catch(e) {
         res.status(500).json({ error: e.message });
      }
  });

  app.get('/api/data/:key', async (req, res) => {
    const { key } = req.params;
    const { limit, offset } = req.query;
    try {
      let data = await getDbData(key);
      
      // Pagination for large collections
      if (Array.isArray(data) && ['invoices', 'transactions', 'system_logs'].includes(key)) {
        if (limit) {
          const limitNum = parseInt(limit as string, 10);
          const offsetNum = parseInt(offset as string, 10) || 0;
          
          // Sort by createdAt descending (if available) or reverse array
          data = data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          data = data.slice(offsetNum, offsetNum + limitNum);
        }
      }
      
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/data/batch', async (req, res) => {
    const { operations } = req.body;
    if (!Array.isArray(operations)) {
      return res.status(400).json({ error: 'Expected operations array' });
    }
    
    try {
      // Group operations by key
      const keys = new Set(operations.map((op: any) => op.key));
      const results: any[] = [];
      const sysLogs = (await getDbData('system_logs')) || [];
      const timestamp = Date.now();
      
      for (const key of Array.from(keys)) {
         let data = (await getDbData(key)) || [];
         if (!Array.isArray(data)) continue;
         
         const keyOps = operations.filter((op: any) => op.key === key);
         for (const op of keyOps) {
            if (op.type === 'append') {
               data.push(op.data);
               results.push({ id: op.data.id, status: 'appended' });
               sysLogs.push({ id: Math.random().toString(36).substring(2, 15), action: 'CREATE', userId: 'system', details: 'ایجاد رکورد گروهی', entityType: key, entityId: op.data.id, timestamp });
            } else if (op.type === 'update') {
               const idx = data.findIndex((x: any) => String(x.id) === String(op.id));
               if (idx !== -1) {
                  data[idx] = { ...data[idx], ...op.data };
                  results.push({ id: op.id, status: 'updated' });
                  sysLogs.push({ id: Math.random().toString(36).substring(2, 15), action: 'UPDATE', userId: 'system', details: 'ویرایش رکورد گروهی', entityType: key, entityId: op.id, timestamp });
               }
            } else if (op.type === 'delete') {
               const idx = data.findIndex((x: any) => String(x.id) === String(op.id));
               if (idx !== -1) {
                  data[idx].isDeleted = true;
                  results.push({ id: op.id, status: 'deleted' });
                  sysLogs.push({ id: Math.random().toString(36).substring(2, 15), action: 'DELETE', userId: 'system', details: 'حذف رکورد گروهی', entityType: key, entityId: op.id, timestamp });
               }
            }
         }
         await setDbData(key, data);
      }
      
      await setDbData('system_logs', sysLogs);
      res.json({ success: true, results });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/data/:key/append', async (req, res) => {
    const { key } = req.params;
    const newItem = req.body;
    try {
      if (!newItem.id) newItem.id = Math.random().toString(36).substring(2, 15);
      
      if (usePg && pgPool) {
         if (!KNOWN_TABLES.includes(key)) return res.status(400).json({ error: 'Unknown table' });
         await pgPool.query(`CREATE TABLE IF NOT EXISTS "${key}" (id VARCHAR PRIMARY KEY)`);
         let finalItem = { ...newItem };
         let related = null;
         if (['invoices', 'sales_invoices', 'purchase_invoices', 'warehouse_receipts', 'warehouse_remittances', 'proforma_invoices', 'sale_returns', 'purchase_returns', 'wastes', 'accounting_documents', 'stocktakings'].includes(key)) {
             const rel = await handleRelations(key, finalItem);
             finalItem = rel.strippedData;
             related = rel;
         }

         await syncTableSchema(pgPool, key, finalItem);
         const keys = Object.keys(finalItem);
         const vals = Object.values(finalItem).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
         const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
         const colNames = keys.map(k => `"${k}"`).join(', ');
         await pgPool.query(`INSERT INTO "${key}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, vals);
         
         if (related && related.childTable) {
             const fId = finalItem.id;
             try {
                const col = (related.childTable === 'invoice_items' || related.childTable.endsWith('_invoice_items') || related.childTable.endsWith('_receipt_items') || related.childTable.endsWith('_remittance_items') || related.childTable.endsWith('_return_items') || related.childTable.endsWith('waste_items')) ? 'invoiceId' : (related.childTable === 'accounting_document_items' ? 'documentId' : 'stocktakingId');
                await pgPool.query(`DELETE FROM "${related.childTable}" WHERE "${col}" = $1`, [fId]);
             } catch(e) {}
             for (const it of related.items) {
                 await syncTableSchema(pgPool, related.childTable, it);
                 const itKeys = Object.keys(it);
                 const itVals = Object.values(it).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                 const itPlaceholders = itKeys.map((_, idx) => `$${idx + 1}`).join(', ');
                 const itColNames = itKeys.map(k => `"${k}"`).join(', ');
                 await pgPool.query(`INSERT INTO "${related.childTable}" (${itColNames}) VALUES (${itPlaceholders}) ON CONFLICT(id) DO UPDATE SET ${itKeys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, itVals);
             }
         }
      } else {
         const data = (await getDbData(key)) || [];
         if (Array.isArray(data)) {
           data.push(newItem);
           await setDbData(key, data);
         } else {
           return res.status(400).json({ error: 'Target is not an array' });
         }
      }

      // Log creation
      const sysLogs = (await getDbData('system_logs')) || [];
      const timestamp = Date.now();
      sysLogs.push({ id: Math.random().toString(36).substring(2, 15), action: 'CREATE', userId: 'system', details: 'ایجاد رکورد جدید', entityType: key, entityId: newItem.id, changes: JSON.stringify(newItem), timestamp });
      if (usePg && pgPool) {
         const log = sysLogs[sysLogs.length - 1];
         await syncTableSchema(pgPool, 'system_logs', log);
         const keys = Object.keys(log);
         const vals = Object.values(log).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
         const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
         const colNames = keys.map(k => `"${k}"`).join(', ');
         await pgPool.query(`INSERT INTO "system_logs" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, vals);
      } else {
         await setDbData('system_logs', sysLogs);
      }

      res.json({ success: true, data: newItem });
    } catch(err: any) {
      console.error('Error in append:', err);
      tableSchemas.delete(req.params.key);
      tableSchemas.delete('system_logs');
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/data/:key/:id', async (req, res) => {
    const { key, id } = req.params;
    const updatedItem = req.body;
    try {
      if (usePg && pgPool) {
         if (!KNOWN_TABLES.includes(key)) return res.status(400).json({ error: 'Unknown table' });
         
         const data = (await getDbData(key)) || [];
         const index = data.findIndex((x: any) => String(x.id) === String(id));
         if (index === -1) {
            return res.status(404).json({ error: 'Not found' });
         }
         const oldItem = data[index];
         const newItem = { ...oldItem, ...updatedItem, id }; // ensure id is preserved
         
         let finalItem = { ...newItem };
         let related = null;
         if (['invoices', 'sales_invoices', 'purchase_invoices', 'warehouse_receipts', 'warehouse_remittances', 'proforma_invoices', 'sale_returns', 'purchase_returns', 'wastes', 'accounting_documents', 'stocktakings'].includes(key)) {
             const rel = await handleRelations(key, finalItem);
             finalItem = rel.strippedData;
             related = rel;
         }

         await syncTableSchema(pgPool, key, finalItem);
         const keys = Object.keys(finalItem);
         const vals = Object.values(finalItem).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
         const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
         const colNames = keys.map(k => `"${k}"`).join(', ');
         await pgPool.query(`INSERT INTO "${key}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, vals);
         
         if (related && related.childTable) {
             const fId = finalItem.id;
             try {
                const col = (related.childTable === 'invoice_items' || related.childTable.endsWith('_invoice_items') || related.childTable.endsWith('_receipt_items') || related.childTable.endsWith('_remittance_items') || related.childTable.endsWith('_return_items') || related.childTable.endsWith('waste_items')) ? 'invoiceId' : (related.childTable === 'accounting_document_items' ? 'documentId' : 'stocktakingId');
                await pgPool.query(`DELETE FROM "${related.childTable}" WHERE "${col}" = $1`, [fId]);
             } catch(e) {}
             for (const it of related.items) {
                 await syncTableSchema(pgPool, related.childTable, it);
                 const itKeys = Object.keys(it);
                 const itVals = Object.values(it).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
                 const itPlaceholders = itKeys.map((_, idx) => `$${idx + 1}`).join(', ');
                 const itColNames = itKeys.map(k => `"${k}"`).join(', ');
                 await pgPool.query(`INSERT INTO "${related.childTable}" (${itColNames}) VALUES (${itPlaceholders}) ON CONFLICT(id) DO UPDATE SET ${itKeys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, itVals);
             }
         }
      } else {
         const data = (await getDbData(key)) || [];
         if (Array.isArray(data)) {
           const index = data.findIndex((x: any) => String(x.id) === String(id));
           if (index !== -1) {
             const oldItem = data[index];
             data[index] = { ...oldItem, ...updatedItem };
             await setDbData(key, data);
           } else {
             return res.status(404).json({ error: 'Not found' });
           }
         } else {
           return res.status(400).json({ error: 'Target is not an array' });
         }
      }

      // Log update
      const sysLogs = (await getDbData('system_logs')) || [];
      const timestamp = Date.now();
      sysLogs.push({ id: Math.random().toString(36).substring(2, 15), action: 'UPDATE', userId: 'system', details: 'ویرایش رکورد', entityType: key, entityId: id, changes: JSON.stringify(updatedItem), timestamp });
      if (usePg && pgPool) {
         const log = sysLogs[sysLogs.length - 1];
         await syncTableSchema(pgPool, 'system_logs', log);
         const keys = Object.keys(log);
         const vals = Object.values(log).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
         const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
         const colNames = keys.map(k => `"${k}"`).join(', ');
         await pgPool.query(`INSERT INTO "system_logs" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ')}`, vals);
      } else {
         await setDbData('system_logs', sysLogs);
      }

      res.json({ success: true, data: { ...updatedItem, id } });
    } catch(err: any) {
      console.error('Error in put:', err);
      tableSchemas.delete(req.params.key);
      tableSchemas.delete('system_logs');
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/data/:key', async (req, res) => {
    const { key } = req.params;
    const data = req.body;

    // Do not log changes to system_logs themselves
    if (key !== 'system_logs' && Array.isArray(data)) {
      try {
         const oldData = (await getDbData(key)) || [];

         if (Array.isArray(oldData)) {
            const oldMap = new Map();
            oldData.forEach(item => { if (item && item.id) oldMap.set(String(item.id), item); });

            const newMap = new Map();
            data.forEach(item => { if (item && item.id) newMap.set(String(item.id), item); });

            const logs = [];
            const timestamp = Date.now();
            let userId = 'system';
            
            // Extract token if any
            if (req.cookies && req.cookies.refreshToken) {
               try {
                 const decoded = jwt.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-key-2024') as any;
                 if (decoded && decoded.username) userId = decoded.username;
               } catch(e) {}
            } else if (req.headers.authorization) {
               try {
                 const token = req.headers.authorization.split(' ')[1];
                 const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-jwt-key-2024') as any;
                 if (decoded && decoded.username) userId = decoded.username;
               } catch(e) {}
            }

            const generateId = () => Math.random().toString(36).substring(2, 15);

            // Find Added and Updated
            newMap.forEach((newItem, id) => {
               if (!oldMap.has(id)) {
                  logs.push({ id: generateId(), action: 'CREATE', userId, details: 'ایجاد رکورد جدید', entityType: key, entityId: id, changes: JSON.stringify(newItem), timestamp });
               } else {
                  const oldItem = oldMap.get(id);
                  const changes: any = {};
                  let hasChanges = false;
                  for (const k in newItem) {
                     if (k !== 'updatedAt' && k !== 'createdAt') {
                       if (JSON.stringify(newItem[k]) !== JSON.stringify(oldItem[k])) {
                          changes[k] = { old: oldItem[k], new: newItem[k] };
                          hasChanges = true;
                       }
                     }
                  }
                  if (hasChanges) {
                     logs.push({ id: generateId(), action: 'UPDATE', userId, details: 'ویرایش رکورد', entityType: key, entityId: id, changes: JSON.stringify(changes), timestamp });
                  }
               }
            });

            // Find Deleted
            oldMap.forEach((oldItem, id) => {
               if (!newMap.has(id)) {
                  logs.push({ id: generateId(), action: 'DELETE', userId, details: 'حذف رکورد', entityType: key, entityId: id, changes: JSON.stringify(oldItem), timestamp });
               }
            });

            if (logs.length > 0) {
               const sysLogs = (await getDbData('system_logs')) || [];
               sysLogs.push(...logs);
               await setDbData('system_logs', sysLogs);
            }
         }
      } catch(err) {
         console.error('Audit log error:', err);
      }
    }

    try {
      await setDbData(key, data);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/recalculate-stocks', async (req, res) => {
    try {
      const products = (await getDbData('products')) || [];
      const invoices = (await getDbData('invoices')) || [];
      const warehouses = (await getDbData('warehouses')) || [];

      // Sort invoices by createdAt to process chronologically
      const sortedInvoices = [...invoices].sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));

      const stocksMap: Record<string, any> = {};
      const historyList: any[] = [];
      const generateId = () => Math.random().toString(36).substring(2, 15);

      products.forEach((p: any) => {
        if (p.type === 'service') return;
        const baseStock = Number(p.stock) || 0;
        const defaultWhId = (p.warehouseId || (warehouses[0]?.id) || 'unknown').toString();
        const key = `${p.id}_${defaultWhId}`;
        
        if (!stocksMap[key]) {
          stocksMap[key] = { productId: p.id, warehouseId: defaultWhId, physicalStock: 0, reservedStock: 0, availableStock: 0 };
        }
        
        if (baseStock > 0) {
           const before = stocksMap[key].physicalStock;
           stocksMap[key].physicalStock += baseStock;
           historyList.push({
             id: generateId(),
             productId: p.id,
             warehouseId: defaultWhId,
             date: new Date().toISOString().split('T')[0],
             type: 'in',
             quantity: baseStock,
             documentType: 'initial_stock',
             documentId: p.id,
             documentNumber: p.code || '',
             description: 'موجودی اولیه',
             balanceBefore: before,
             balanceAfter: stocksMap[key].physicalStock,
             timestamp: 0,
           });
        }
      });

      const saleQtysMap: Record<string, number> = {};
      const remittedSaleQtysMap: Record<string, number> = {};

      sortedInvoices.forEach((inv: any) => {
        if (inv.isDraft || inv.status === 'draft' || inv.status === 'voided' || inv.isDeleted) return;
        if (!inv.items || !Array.isArray(inv.items)) return;
        inv.items.forEach((i: any) => {
          const prodId = i.productId;
          if (!prodId) return;
          const product = products.find((p: any) => p.id?.toString() === prodId.toString());
          if (!product || product.type === 'service') return;

          let q = Number(i.quantity) || 0;
          if (i.isSecondaryUnit && product.unitRatio) q = q * Number(product.unitRatio);

          const defaultWhId = (product.warehouseId || (warehouses[0]?.id) || 'unknown').toString();
          const whId = (i.warehouseId || inv.warehouseId || defaultWhId).toString();
          const key = `${prodId}_${whId}`;

          if (!stocksMap[key]) stocksMap[key] = { productId: prodId, warehouseId: whId, physicalStock: 0, reservedStock: 0, availableStock: 0 };

          if (inv.type === 'warehouse_receipt') {
            const before = stocksMap[key].physicalStock;
            stocksMap[key].physicalStock += q;
            historyList.push({
               id: generateId(),
               productId: prodId,
               warehouseId: whId,
               date: inv.date || new Date(inv.createdAt || Date.now()).toISOString().split('T')[0],
               type: 'in',
               quantity: q,
               documentType: 'warehouse_receipt',
               documentId: inv.id,
               documentNumber: inv.invoiceNumber || inv.documentNumber || '',
               description: `رسید انبار ${inv.invoiceNumber || inv.documentNumber || ''}`,
               balanceBefore: before,
               balanceAfter: stocksMap[key].physicalStock,
               timestamp: inv.createdAt || Date.now(),
            });
          } else if (inv.type === 'warehouse_remittance') {
            const before = stocksMap[key].physicalStock;
            stocksMap[key].physicalStock -= q;
            historyList.push({
               id: generateId(),
               productId: prodId,
               warehouseId: whId,
               date: inv.date || new Date(inv.createdAt || Date.now()).toISOString().split('T')[0],
               type: 'out',
               quantity: q,
               documentType: 'warehouse_remittance',
               documentId: inv.id,
               documentNumber: inv.invoiceNumber || inv.documentNumber || '',
               description: `حواله انبار ${inv.invoiceNumber || inv.documentNumber || ''}`,
               balanceBefore: before,
               balanceAfter: stocksMap[key].physicalStock,
               timestamp: inv.createdAt || Date.now(),
            });

            if (inv.sourceInvoiceId) {
              const sourceInv = invoices.find((sinv: any) => sinv.id?.toString() === inv.sourceInvoiceId?.toString());
              if (sourceInv && sourceInv.type === 'sale') remittedSaleQtysMap[key] = (remittedSaleQtysMap[key] || 0) + q;
            } else {
              remittedSaleQtysMap[key] = (remittedSaleQtysMap[key] || 0) + q;
            }
          } else if (inv.type === 'sale') {
            saleQtysMap[key] = (saleQtysMap[key] || 0) + q;
          }
        });
      });

      const productGlobalSales: Record<string, number> = {};
      const productGlobalRemitted: Record<string, number> = {};
      
      Object.keys(saleQtysMap).forEach(key => {
        const prodId = key.split('_')[0];
        productGlobalSales[prodId] = (productGlobalSales[prodId] || 0) + saleQtysMap[key];
      });
      Object.keys(remittedSaleQtysMap).forEach(key => {
        const prodId = key.split('_')[0];
        productGlobalRemitted[prodId] = (productGlobalRemitted[prodId] || 0) + remittedSaleQtysMap[key];
      });
      
      Object.keys(productGlobalSales).forEach(prodId => {
        const unremitted = Math.max(0, (productGlobalSales[prodId] || 0) - (productGlobalRemitted[prodId] || 0));
        if (unremitted > 0) {
          const product = products.find((p: any) => p.id.toString() === prodId.toString());
          const defaultWhId = (product?.warehouseId || (warehouses[0]?.id) || 'unknown').toString();
          const key = `${prodId}_${defaultWhId}`;
          if (!stocksMap[key]) stocksMap[key] = { productId: prodId, warehouseId: defaultWhId, physicalStock: 0, reservedStock: 0, availableStock: 0 };
          stocksMap[key].reservedStock += unremitted;
        }
      });

      const finalStocksList: any[] = Object.keys(stocksMap).map(key => {
        const item = stocksMap[key];
        return {
          id: key,
          productId: item.productId,
          warehouseId: item.warehouseId,
          physicalStock: item.physicalStock,
          reservedStock: item.reservedStock,
          availableStock: item.physicalStock - item.reservedStock,
          lastUpdated: Date.now()
        };
      });

      await setDbData('InventoryTransactions', historyList);
      await setDbData('warehouse_stocks', finalStocksList);
      res.json({ success: true, data: finalStocksList });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/stats', async (req, res) => {
    try {
      let totalSize = 0;
      try {
        if (!usePg) {
           const stats = await fsPromises.stat(SQLITE_FILE);
           totalSize = stats.size;
        } else {
           // mock size for PG or fetch from pg_database size
           const res = await pgPool.query('SELECT pg_database_size(current_database()) as size');
           if (res.rows.length > 0) totalSize = parseInt(res.rows[0].size, 10);
        }
      } catch(e) {}
      
      const rows = await getAllDbData();
      const collections = [];
      
      for (const row of rows) {
        const value = row.value;
        const sizeBytes = Buffer.byteLength(JSON.stringify(value) || '', 'utf8');
        let recordCount = Array.isArray(value) ? value.length : (value ? Object.keys(value).length : 0);
        collections.push({ name: row.key, size: sizeBytes, recordCount });
      }
      
      res.json({ totalSize, collections });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/backup', async (req, res) => {
    try {
      const rows = await getAllDbData();
      const backupData: any = {};
      for (const row of rows) {
        backupData[row.key] = row.value;
      }
      
      const fileName = `backup-${Date.now()}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.send(JSON.stringify(backupData, null, 2));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/restore', async (req, res) => {
    try {
      if (usePg && pgPool) {
          // req.body could be parsed JSON from old backups or raw SQL string.
          // Because Express body-parser is set up, it might have failed to parse if it was SQL, unless we added a text parser.
          // Let's assume req.body is string for SQL or object for JSON
          if (typeof req.body === 'string' && req.body.includes('Professional Postgres Dump')) {
              await pgPool.query(req.body);
              return res.json({ success: true });
          } else if (typeof req.body === 'object') {
              // Old JSON format restore
              const parsed = req.body;
              for (const key of KNOWN_TABLES) {
                try { await pgPool.query(`TRUNCATE TABLE "${key}" CASCADE`); } catch (e) {}
              }
              for (const [key, value] of Object.entries(parsed)) {
                 if (KNOWN_TABLES.includes(key)) await setDbData(key, value);
              }
              return res.json({ success: true });
          } else {
              return res.status(400).json({ error: 'فرمت فایل پشتیبان معتبر نیست.' });
          }
      } else {
          const parsed = req.body;
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return res.status(400).json({ error: 'فرمت فایل پشتیبان معتبر نیست. فایل باید شامل یک شیء JSON با ساختار معتبر کلید-مقدار باشد.' });
          }
          try { getDb().prepare('DELETE FROM store').run(); } catch (e) {}
          for (const [key, value] of Object.entries(parsed)) {
            if (KNOWN_TABLES.includes(key)) {
              await setDbData(key, value);
            }
          }
          res.json({ success: true });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/sys/dirs', async (req, res) => {
    try {
      const target = req.body.path || process.cwd();
      const items = await fsPromises.readdir(target, { withFileTypes: true });
      const dirs = items.filter(i => i.isDirectory()).map(i => i.name);
      const parent = path.dirname(target);
      res.json({ current: target, parent, dirs });
    } catch(err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/sys/drives', async (req, res) => {
    try {
       if (process.platform === 'win32') {
          res.json(['C:\\', 'D:\\', 'E:\\', 'F:\\']);
       } else {
          res.json(['/']);
       }
    } catch (e) {
       res.json(['/']);
    }
  });

  app.get('/api/setup/status', async (req, res) => {
    try {
       let configExists = false;
       try {
           await fsPromises.access(DB_CONFIG_FILE);
           configExists = true;
       } catch(e) {}
       
       const usingEnvVars = !!(process.env.SQL_HOST || process.env.DATABASE_URL);
       
       const users = await getDbData('users') || [];
       const adminConfigured = users.length > 0;
       
       const profile = await getDbData('company_profile') || null;
       const companyConfigured = !!(profile && profile.companyName);
       
       const dbConfigured = configExists || usingEnvVars || (adminConfigured && companyConfigured);
       
       res.json({ 
         dbConfigured, 
         usingEnvVars,
         adminConfigured,
         companyConfigured,
         isComplete: dbConfigured && adminConfigured,
         companyProfile: profile,
         adminUser: users.length > 0 ? { username: users[0].username } : null
       });
    } catch(e) {
       res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/setup/admin', async (req, res) => {
    try {
      const { username, password } = req.body;
      const users = await getDbData('users') || [];
      const hashed = await bcrypt.hash(password, 10);
      
      const adminIndex = users.findIndex((u: any) => u.role === 'admin' || u.username === username);
      if (adminIndex !== -1) {
        users[adminIndex].username = username;
        users[adminIndex].password = hashed;
        await setDbData('users', users);
      } else {
        const adminUser = {
          id: Math.random().toString(36).substring(2, 15),
          username,
          password: hashed,
          role: 'admin',
          createdAt: new Date().toISOString(),
          firstName: 'مدیر',
          lastName: 'سیستم',
          isActive: true
        };
        users.push(adminUser);
        await setDbData('users', users);
      }
      res.json({ success: true });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/setup/company', async (req, res) => {
    try {
      const profileData = req.body;
      const existing = await getDbData('company_profile') || {};
      const updatedProfile = { ...existing, ...profileData };
      await setDbData('company_profile', updatedProfile);
      res.json({ success: true });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/db/config', async (req, res) => {
    try {
      const { connectionString, dbName, engine } = req.body;

      if (engine === 'sqlite' || connectionString === 'sqlite') {
         const config = { engine: 'sqlite' };
         await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
         usePg = false;
         pgPool = null;
         return res.json({ success: true });
      }

      let finalConnectionString = connectionString;
      
      // Initial connection to create DB if needed
      const client = new Client({ connectionString });
      await client.connect();

      if (dbName) {
        // Check if database exists
        const dbCheck = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
        if (dbCheck.rowCount === 0) {
           await client.query(`CREATE DATABASE "${dbName}"`);
        }
        
        // Append or replace the pathname with the new DB name
        const url = new URL(connectionString);
        url.pathname = `/${dbName}`;
        finalConnectionString = url.toString();
      }

      await client.end();

      // Test connection to the actual database
      const finalClient = new Client({ connectionString: finalConnectionString });
      await finalClient.connect();
      await finalClient.query('SELECT NOW()');
      await finalClient.end();

      const config = { engine: 'postgres', connectionString: finalConnectionString };
      await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
      
      // Try to re-init DB with new connection
      pgPool = await connectPgDb(finalConnectionString);
      usePg = true;
      await ensurePostgresTables();
      await migrateSqliteToPostgres();

      
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  app.post('/api/db/test', async (req, res) => {
    try {
      const { connectionString } = req.body;
      const client = new Client({ connectionString });
      await client.connect();
      await client.query('SELECT NOW()');
      await client.end();
      res.json({ success: true, message: 'اتصال با موفقیت انجام شد' });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  app.post('/api/system/update', (req, res) => {
    // In the cloud environment, we don't want to reset the repository as it would overwrite the user's changes.
    res.json({ success: true, message: 'بروزرسانی سیستم در این محیط ابری به صورت خودکار مدیریت می‌شود و نیازی به بروزرسانی دستی نیست.' });
  });

  app.post('/api/db/execute', async (req, res) => {
    const { query, params } = req.body;
    try {
      if (usePg && pgPool) {
         const isSelect = query.trim().toUpperCase().startsWith('SELECT');
         const result = await pgPool.query(query, params || []);
         if (isSelect) {
           res.json({ results: result.rows });
         } else {
           res.json({ info: { changes: result.rowCount } });
         }
      } else {
        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        const stmt = getDb().prepare(query);
        if (isSelect) {
          const results = stmt.all(...(params || []));
          res.json({ results });
        } else {
          const info = stmt.run(...(params || []));
          res.json({ info });
        }
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  
  // --- REPORTS APIs ---
  app.get('/api/reports/analytical', async (req, res) => {
    try {
      const products = await getDbData('products') || [];
      const warehouses = await getDbData('warehouses') || [];
      const warehouseStocks = await getDbData('warehouse_stocks') || [];
      const invoices = await getDbData('invoices') || [];
      
      const realProducts = products.filter(p => p.type !== 'service');
      
      // Inventory by warehouse
      const inventoryByWarehouse = warehouses.map(wh => {
        const whStocks = warehouseStocks.filter(s => String(s.warehouseId) === String(wh.id));
        let totalItems = 0;
        let totalValue = 0;
        whStocks.forEach(stock => {
          const p = realProducts.find(prod => String(prod.id) === String(stock.productId));
          if (p) {
            const qty = Number(stock.physicalStock) || 0;
            totalItems += qty;
            totalValue += qty * (Number(p.price) || 0);
          }
        });
        return { name: wh.name, totalItems, totalValue };
      }).filter(item => item.totalItems > 0);

      // Top Selling Products
      const saleInvoices = invoices.filter(inv => inv.type === 'sale' && inv.status !== 'voided' && !inv.isDeleted && inv.status !== 'draft' && !inv.isDraft);
      const productSales: Record<string, {qty: number, rev: number}> = {};
      saleInvoices.forEach(inv => {
        if (Array.isArray(inv.items)) {
          inv.items.forEach(item => {
            const pid = String(item.productId);
            if (!productSales[pid]) productSales[pid] = { qty: 0, rev: 0 };
            productSales[pid].qty += Number(item.quantity) || 0;
            productSales[pid].rev += (Number(item.quantity) || 0) * (Number(item.price) || 0);
          });
        }
      });
      
      const topProductsBySales = Object.entries(productSales).map(([pid, data]) => {
        const p = realProducts.find(prod => String(prod.id) === pid);
        return { name: p ? p.name : 'نامشخص', sales: data.qty, revenue: data.rev };
      }).sort((a, b) => b.sales - a.sales).slice(0, 5);

      // Monthly Sales
      const monthlyData: Record<string, {sales: number, revenue: number}> = {};
      saleInvoices.forEach(inv => {
        const d = inv.date || new Date().toISOString();
        const month = d.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) monthlyData[month] = { sales: 0, revenue: 0 };
        monthlyData[month].sales++;
        monthlyData[month].revenue += Number(inv.totalAmount) || 0;
      });
      
      const monthlySales = Object.entries(monthlyData).map(([month, data]) => ({
        month, sales: data.sales, revenue: data.revenue
      })).sort((a, b) => a.month.localeCompare(b.month));

      res.json({
        success: true,
        data: {
          inventoryByWarehouse,
          topProductsBySales,
          monthlySales,
          totalProducts: realProducts.length,
          totalSalesVolume: saleInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0)
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  });
  // --- END REPORTS APIs ---

  app.post('/api/search-products', async (req, res) => {
    const { query, category } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }
  
    try {
      const prompt = `Generate a realistic list of 10 fake products related to "${query}"${category ? ` in the category of "${category}"` : ''}. Focus on Persian product names. Return purely a JSON array of objects with keys "name", "description", and "priceStr". No markdown formatting, no backticks, just raw JSON.`;
      
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const text = await response.text();
      let cleanText = text;
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        cleanText = match[0];
      } else {
        cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      
      const products = JSON.parse(cleanText || "[]");
      
      res.json({ products });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  let migrationState = {
    status: 'idle',
    progress: 0,
    total: 0,
    logs: [] as string[],
    error: null as string | null
  };

  app.post('/api/migrate-postgres/validate', async (req, res) => {
    const { connectionString } = req.body;
    try {
      const client = await connectPgDb(connectionString);
      await client.query('SELECT NOW()');
      await client.end();
      res.json({ success: true, message: 'اتصال با موفقیت برقرار شد.' });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  
  app.get('/api/migrate-postgres/tables', (req, res) => {
    try {
      const stmt = getDb().prepare('SELECT key FROM store');
      const allRows = stmt.all();
      const tables = allRows.map(r => r.key).filter(k => KNOWN_TABLES.includes(k));
      res.json({ success: true, tables });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/migrate-postgres/table/:table', async (req, res) => {
    const { table } = req.params;
    const { connectionString } = req.body;
    
    if (!KNOWN_TABLES.includes(table)) {
        return res.status(400).json({ error: 'جدول نامعتبر است' });
    }

    try {
      const client = new Client({ connectionString });
      await client.connect();

      const stmt = getDb().prepare('SELECT value FROM store WHERE key = ?');
      const row = stmt.get(table);
      if (!row) {
         await client.end();
         return res.status(404).json({ error: 'داده‌ای برای این جدول یافت نشد' });
      }

      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      await client.query(`CREATE TABLE "${table}" (id VARCHAR PRIMARY KEY)`);
      
      const data = JSON.parse(row.value);
      
      await client.query('BEGIN');
      let migratedCount = 0;
      tableSchemas.clear();

      if (table === 'company_profile' || table === 'backupConfig' || !Array.isArray(data)) {
          if (data && typeof data === 'object') {
              data.id = 'singleton';
              await syncTableSchema(client, table, data);
              const keys = Object.keys(data);
              const vals = Object.values(data).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
              const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
              const colNames = keys.map(k => `"${k}"`).join(', ');
              await client.query(`INSERT INTO "${table}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO NOTHING`, vals);
              migratedCount = 1;
          }
      } else {
          for (const item of data) {
              if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
              await syncTableSchema(client, table, item);
              const keys = Object.keys(item);
              const vals = Object.values(item).map(v => v === undefined ? null : (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);
              const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
              const colNames = keys.map(k => `"${k}"`).join(', ');
              await client.query(`INSERT INTO "${table}" (${colNames}) VALUES (${placeholders}) ON CONFLICT(id) DO NOTHING`, vals);
              migratedCount++;
          }
      }

      await client.query('COMMIT');
      await client.end();
      res.json({ success: true, count: migratedCount });
    } catch (e) {
      console.error(`Error migrating table ${table}:`, e);
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.get('/api/migrate-postgres/status', (req, res) => {
    res.json(migrationState);
  });

  app.post('/api/migrate-postgres/reset', (req, res) => {
    migrationState = { status: 'idle', progress: 0, total: 0, logs: [], error: null };
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
