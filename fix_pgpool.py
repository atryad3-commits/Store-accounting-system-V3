import sys
import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add activePgPools map and loadPgPoolForStore function
pools_code = """
const activePgPools: Record<string, any> = {};
const usePgMap: Record<string, boolean> = {};

async function loadPgPoolForStore(storeId: string) {
    if (activePgPools[storeId] !== undefined) return;
    
    if (storeId === 'default') {
        try {
            const configRaw = await fsPromises.readFile(DB_CONFIG_FILE, 'utf-8');
            const config = JSON.parse(configRaw);
            if (config.engine === 'postgres' && config.connectionString) {
                const pool = await connectPgDb(config.connectionString);
                activePgPools['default'] = pool;
                usePgMap['default'] = true;
                return;
            }
        } catch(e) {}
        
        if (process.env.SQL_HOST && process.env.SQL_USER) {
            const pool = new Pool({
                host: process.env.SQL_HOST,
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DB_NAME,
            });
            await pool.query('SELECT 1');
            activePgPools['default'] = pool;
            usePgMap['default'] = true;
            return;
        } else if (process.env.DATABASE_URL) {
            const pool = await connectPgDb(process.env.DATABASE_URL);
            activePgPools['default'] = pool;
            usePgMap['default'] = true;
            return;
        }
        
        activePgPools['default'] = null;
        usePgMap['default'] = false;
        return;
    }
    
    // For other stores
    const defaultDb = storeContext.run('default', () => getDb());
    try {
        const stmt = defaultDb.prepare("SELECT * FROM businesses WHERE id = ?");
        const business = stmt.get(storeId);
        
        if (business && business.db_type === 'postgres') {
            const configRaw = await fsPromises.readFile(DB_CONFIG_FILE, 'utf-8');
            const config = JSON.parse(configRaw);
            if (config.engine === 'postgres' && config.connectionString) {
                const url = new URL(config.connectionString);
                url.pathname = `/${business.db_name}`;
                const pool = await connectPgDb(url.toString());
                activePgPools[storeId] = pool;
                usePgMap[storeId] = true;
                return;
            }
        }
    } catch(e) {}
    
    activePgPools[storeId] = null;
    usePgMap[storeId] = false;
}

function getActivePgPool() {
    const storeId = storeContext.getStore() || 'default';
    return activePgPools[storeId] || null;
}

function isPgActive() {
    const storeId = storeContext.getStore() || 'default';
    return !!usePgMap[storeId];
}
"""

# Replace global declarations of pgPool and usePg
content = re.sub(r'let pgPool: any = null;\nlet usePg = false;', pools_code, content)

# Remove old initDB logic that sets pgPool globally, but keep initDB
old_initdb = """async function initDB() {
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
  }"""

new_initdb = """async function initDB() {
  await loadPgPoolForStore('default');
"""
content = content.replace(old_initdb, new_initdb)

# Replace the middleware to await loadPgPoolForStore
old_mw = """  app.use((req, res, next) => {
    const storeId = req.headers['x-store-id'] || 'default';
    storeContext.run(storeId, () => {
      next();
    });
  });"""

new_mw = """  app.use((req, res, next) => {
    const storeId = req.headers['x-store-id'] || 'default';
    storeContext.run(storeId, () => {
      loadPgPoolForStore(storeId).then(() => next()).catch(next);
    });
  });"""
content = content.replace(old_mw, new_mw)

# Replace occurrences of pgPool with getActivePgPool()
content = re.sub(r'(?<!active)pgPool(?!s)', 'getActivePgPool()', content)

# Replace usePg with isPgActive()
content = re.sub(r'usePg(?!Map)', 'isPgActive()', content)

with open('server.ts', 'w') as f:
    f.write(content)
