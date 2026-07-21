with open('server.ts', 'r') as f:
    content = f.read()

api = """
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
      const id = encodeURIComponent(name.replace(/\\s+/g, '_'));
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
"""

if '/api/databases' not in content:
    content = content.replace("app.use(cookieParser());", "app.use(cookieParser());\n" + api)

with open('server.ts', 'w') as f:
    f.write(content)
