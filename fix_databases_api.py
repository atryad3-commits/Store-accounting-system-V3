import sys
with open('server.ts', 'r') as f:
    content = f.read()

old_get_db = """function getDb() {
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
}"""

new_get_db = """function getDb() {
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
    if (storeId === 'default') {
      dbs[storeId].exec(`
        CREATE TABLE IF NOT EXISTS businesses (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          db_type TEXT DEFAULT 'sqlite',
          db_host TEXT,
          db_port TEXT,
          db_name TEXT,
          db_user TEXT,
          db_password TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
  }
  return dbs[storeId];
}"""

content = content.replace(old_get_db, new_get_db)

api_block_start = "app.get('/api/databases', async (req, res) => {"
api_block_end = "app.post('/api/databases', async (req, res) => {"
end_index = content.find(api_block_end)
if end_index != -1:
    end_index = content.find("});", end_index) + 3

# Wait, let's just do a manual replacement using regex or split.
