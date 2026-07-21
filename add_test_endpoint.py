import sys

with open('server.ts', 'r') as f:
    content = f.read()

endpoint = """  app.get('/api/databases/:id/test-connection', async (req, res) => {
    try {
      const { id } = req.params;
      
      let business = null;
      if (usePgMap['default'] && activePgPools['default']) {
          const r = await activePgPools['default'].query("SELECT * FROM businesses WHERE id = $1", [id]);
          if (r.rows.length > 0) business = r.rows[0];
      } else {
          const defaultDb = storeContext.run('default', () => getDb());
          try {
              const stmt = defaultDb.prepare("SELECT * FROM businesses WHERE id = ?");
              business = stmt.get(id);
          } catch(e) {}
      }
      
      // Default store is always valid if we reach here
      if (id === 'default' && !business) {
          return res.json({ success: true });
      }

      if (!business && id !== 'default') {
          // it might be a sqlite file without db entry
          try {
             const stat = await fsPromises.stat(path.join(process.cwd(), `database_${id}.sqlite`));
             return res.json({ success: true });
          } catch(e) {
             return res.status(404).json({ error: 'Business not found' });
          }
      }
      
      if (business && business.db_type === 'postgres') {
          try {
              const configRaw = await fsPromises.readFile(DB_CONFIG_FILE, 'utf-8');
              const config = JSON.parse(configRaw);
              if (config.engine === 'postgres' && config.connectionString) {
                  const url = new URL(config.connectionString);
                  url.pathname = `/${business.db_name}`;
                  const pool = new Pool({ connectionString: url.toString() });
                  await pool.query('SELECT 1');
                  await pool.end();
                  return res.json({ success: true });
              } else {
                  return res.status(500).json({ error: 'Postgres config missing' });
              }
          } catch(e) {
              return res.status(500).json({ error: 'Connection failed: ' + e.message });
          }
      } else {
          return res.json({ success: true });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/databases/:id', async (req, res) => {"""

content = content.replace("  app.put('/api/databases/:id', async (req, res) => {", endpoint)

with open('server.ts', 'w') as f:
    f.write(content)
