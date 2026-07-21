import sys

with open('server.ts', 'r') as f:
    content = f.read()

start_marker = "  app.get('/api/databases', async (req, res) => {"
end_marker = "  app.use((req, res, next) => {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_apis = """  app.get('/api/databases', async (req, res) => {
    try {
      let dbsFromTable = [];
      try {
        const defaultDb = storeContext.run('default', () => getDb());
        const stmt = defaultDb.prepare("SELECT * FROM businesses");
        dbsFromTable = stmt.all();
      } catch (e) {}

      const files = await fsPromises.readdir(process.cwd());
      const dbsFromFiles = files
        .filter(f => f.startsWith('database') && f.endsWith('.sqlite'))
        .map(f => {
          if (f === 'database.sqlite') return { id: 'default', name: 'فروشگاه اصلی', db_type: 'sqlite' };
          const match = f.match(/^database_(.+)\\.sqlite$/);
          if (match) return { id: match[1], name: decodeURIComponent(match[1]), db_type: 'sqlite' };
          return null;
        })
        .filter(Boolean);

      const mergedMap = new Map();
      dbsFromFiles.forEach(db => mergedMap.set(db.id, db));
      dbsFromTable.forEach(db => mergedMap.set(db.id, {
         id: db.id, 
         name: db.name, 
         db_type: db.db_type, 
         db_host: db.db_host, 
         db_port: db.db_port, 
         db_name: db.db_name,
         db_user: db.db_user,
         db_password: db.db_password
      }));

      res.json({ success: true, databases: Array.from(mergedMap.values()) });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/databases/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, db_type, db_host, db_port, db_name, db_user, db_password } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });
      if (id === 'default') return res.status(400).json({ error: 'Cannot rename default store' });
      
      const defaultDb = storeContext.run('default', () => getDb());
      const checkStmt = defaultDb.prepare("SELECT * FROM businesses WHERE id = ?");
      const existing = checkStmt.get(id);

      if (existing) {
        const stmt = defaultDb.prepare(`
          UPDATE businesses SET 
            name = ?, 
            db_type = COALESCE(?, db_type), 
            db_host = COALESCE(?, db_host), 
            db_port = COALESCE(?, db_port), 
            db_name = COALESCE(?, db_name), 
            db_user = COALESCE(?, db_user), 
            db_password = COALESCE(?, db_password) 
          WHERE id = ?
        `);
        stmt.run(name, db_type, db_host, db_port, db_name, db_user, db_password, id);
        res.json({ success: true, database: { id, name, db_type: db_type || existing.db_type, db_host, db_port, db_name, db_user, db_password } });
      } else {
        // Fallback for file-only databases being renamed
        const newId = encodeURIComponent(name.replace(/\\s+/g, '_'));
        const oldFile = path.join(process.cwd(), `database_${id}.sqlite`);
        const newFile = path.join(process.cwd(), `database_${newId}.sqlite`);
        
        if (dbs[id]) {
          try { dbs[id].close(); } catch(e) {}
          delete dbs[id];
        }
        await fsPromises.rename(oldFile, newFile);
        res.json({ success: true, database: { id: newId, name } });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/databases/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (id === 'default') return res.status(400).json({ error: 'Cannot delete default store' });
      
      const defaultDb = storeContext.run('default', () => getDb());
      try {
        const stmt = defaultDb.prepare("DELETE FROM businesses WHERE id = ?");
        stmt.run(id);
      } catch(e) {}

      const dbFile = path.join(process.cwd(), `database_${id}.sqlite`);
      if (dbs[id]) {
        try { dbs[id].close(); } catch(e) {}
        delete dbs[id];
      }
      try { await fsPromises.unlink(dbFile); } catch(e) {}
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/databases', async (req, res) => {
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
  });

"""
    content = content[:start_idx] + new_apis + content[end_idx:]
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Replaced!")
else:
    print("Markers not found!")
