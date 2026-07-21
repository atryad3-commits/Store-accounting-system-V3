import sys
import re

with open('server.ts', 'r') as f:
    content = f.read()

# We need to replace POST /api/databases to auto-provision Postgres if db_config.json says postgres
post_db = """  app.post('/api/databases', async (req, res) => {
    try {
      const { name, db_type, db_host, db_port, db_name, db_user, db_password } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });
      
      const id = encodeURIComponent(name.replace(/\\s+/g, '_')) + '_' + Date.now();
      const defaultDb = storeContext.run('default', () => getDb());
      try {
        const stmt = defaultDb.prepare(`
          INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, name, db_type || 'sqlite', db_host || '', db_port || '', db_name || '', db_user || '', db_password || '');
      } catch(e) {}

      if (!db_type || db_type === 'sqlite') {
        const dbFile = path.join(process.cwd(), `database_${id}.sqlite`);
        const newDb = new DatabaseSync(dbFile);
        newDb.exec(`
          CREATE TABLE IF NOT EXISTS store (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )
        `);
      }

      res.json({ success: true, database: { id, name, db_type: db_type || 'sqlite', db_host, db_port, db_name, db_user, db_password } });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });"""

new_post_db = """  app.post('/api/databases', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });
      
      const id = encodeURIComponent(name.replace(/\\s+/g, '_')) + '_' + Date.now();
      let actualDbType = 'sqlite';
      
      try {
        const configRaw = await fsPromises.readFile(DB_CONFIG_FILE, 'utf-8');
        const config = JSON.parse(configRaw);
        if (config.engine === 'postgres' && config.connectionString) {
          actualDbType = 'postgres';
          // Provision a new Postgres database for this business
          const dbNameForBusiness = `store_${id}`.replace(/[^a-zA-Z0-9_]/g, '');
          
          const client = new Client({ connectionString: config.connectionString });
          await client.connect();
          await client.query(`CREATE DATABASE "${dbNameForBusiness}"`);
          await client.end();
          
          // Connect to new DB and initialize schema? 
          // We don't have to initialize the schema here because `getDbData` and other APIs handle it dynamically, 
          // but we should probably wait for it.
          // Wait, the client doesn't connect if we just store the connection string.
          // In businesses table, we store the new db_name, the rest we can leave empty 
          // and infer from db_config.json on runtime, or we store the full connection string.
          // For simplicity, we just store the new dbName.
          
          const defaultDb = storeContext.run('default', () => getDb());
          try {
            const stmt = defaultDb.prepare(`
              INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            // We just store db_name. The connect function will read db_config.json and replace the db name.
            stmt.run(id, name, 'postgres', '', '', dbNameForBusiness, '', '');
          } catch(e) {}
          
          return res.json({ success: true, database: { id, name, db_type: 'postgres', db_name: dbNameForBusiness } });
        }
      } catch (e) {
         console.log("Error checking config or creating postgres DB, falling back to sqlite:", e);
      }

      // SQLite fallback
      const defaultDb = storeContext.run('default', () => getDb());
      try {
        const stmt = defaultDb.prepare(`
          INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, name, 'sqlite', '', '', '', '', '');
      } catch(e) {}

      const dbFile = path.join(process.cwd(), `database_${id}.sqlite`);
      const newDb = new DatabaseSync(dbFile);
      newDb.exec(`
        CREATE TABLE IF NOT EXISTS store (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);

      res.json({ success: true, database: { id, name, db_type: 'sqlite' } });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });"""

content = content.replace(post_db, new_post_db)

with open('server.ts', 'w') as f:
    f.write(content)
