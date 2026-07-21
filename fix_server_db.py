import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace db variable
content = content.replace("let db: any;", "const dbs: Record<string, any> = {};\nfunction getDb() {\n  const storeId = storeContext.getStore() || 'default';\n  if (!dbs[storeId]) {\n    const dbFile = storeId === 'default' ? SQLITE_FILE : path.join(process.cwd(), `database_${storeId}.sqlite`);\n    dbs[storeId] = new DatabaseSync(dbFile);\n    dbs[storeId].exec(`\n      CREATE TABLE IF NOT EXISTS store (\n        key TEXT PRIMARY KEY,\n        value TEXT NOT NULL\n      )\n    `);\n  }\n  return dbs[storeId];\n}")

# Replace db. usage with getDb().
content = re.sub(r'\bdb\.', 'getDb().', content)

with open('server.ts', 'w') as f:
    f.write(content)
