import sys

with open('server.ts', 'r') as f:
    content = f.read()

# Replace loadPgPoolForStore
old_load_pg_pool = """    // For other stores
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
    } catch(e) {}"""

new_load_pg_pool = """    // For other stores
    try {
        let business = null;
        if (usePgMap['default'] && activePgPools['default']) {
            const res = await activePgPools['default'].query("SELECT * FROM businesses WHERE id = $1", [storeId]);
            if (res.rows.length > 0) business = res.rows[0];
        } else {
            const defaultDb = storeContext.run('default', () => getDb());
            const stmt = defaultDb.prepare("SELECT * FROM businesses WHERE id = ?");
            business = stmt.get(storeId);
        }
        
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
    } catch(e) {}"""

content = content.replace(old_load_pg_pool, new_load_pg_pool)


old_get_dbs = """      try {
        const defaultDb = storeContext.run('default', () => getDb());
        const stmt = defaultDb.prepare("SELECT * FROM businesses");
        dbsFromTable = stmt.all();
      } catch (e) {}"""

new_get_dbs = """      try {
        if (usePgMap['default'] && activePgPools['default']) {
            await activePgPools['default'].query(`
              CREATE TABLE IF NOT EXISTS businesses (
                id VARCHAR PRIMARY KEY,
                name VARCHAR NOT NULL,
                db_type VARCHAR DEFAULT 'sqlite',
                db_host VARCHAR,
                db_port VARCHAR,
                db_name VARCHAR,
                db_user VARCHAR,
                db_password VARCHAR
              )
            `);
            const r = await activePgPools['default'].query("SELECT * FROM businesses");
            dbsFromTable = r.rows;
        } else {
            const defaultDb = storeContext.run('default', () => getDb());
            const stmt = defaultDb.prepare("SELECT * FROM businesses");
            dbsFromTable = stmt.all();
        }
      } catch (e) {}"""

content = content.replace(old_get_dbs, new_get_dbs)


old_put_db = """      const defaultDb = storeContext.run('default', () => getDb());
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
      } else {"""

new_put_db = """      let existing = null;
      if (usePgMap['default'] && activePgPools['default']) {
          const r = await activePgPools['default'].query("SELECT * FROM businesses WHERE id = $1", [id]);
          if (r.rows.length > 0) existing = r.rows[0];
      } else {
          const defaultDb = storeContext.run('default', () => getDb());
          const checkStmt = defaultDb.prepare("SELECT * FROM businesses WHERE id = ?");
          existing = checkStmt.get(id);
      }

      if (existing) {
        if (usePgMap['default'] && activePgPools['default']) {
            await activePgPools['default'].query(`
              UPDATE businesses SET 
                name = $1, 
                db_type = COALESCE($2, db_type), 
                db_host = COALESCE($3, db_host), 
                db_port = COALESCE($4, db_port), 
                db_name = COALESCE($5, db_name), 
                db_user = COALESCE($6, db_user), 
                db_password = COALESCE($7, db_password) 
              WHERE id = $8
            `, [name, db_type, db_host, db_port, db_name, db_user, db_password, id]);
        } else {
            const defaultDb = storeContext.run('default', () => getDb());
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
        }
        res.json({ success: true, database: { id, name, db_type: db_type || existing.db_type, db_host, db_port, db_name, db_user, db_password } });
      } else {"""

content = content.replace(old_put_db, new_put_db)


old_del_db = """      const defaultDb = storeContext.run('default', () => getDb());
      try {
        const stmt = defaultDb.prepare("DELETE FROM businesses WHERE id = ?");
        stmt.run(id);
      } catch(e) {}"""

new_del_db = """      try {
        if (usePgMap['default'] && activePgPools['default']) {
            await activePgPools['default'].query("DELETE FROM businesses WHERE id = $1", [id]);
        } else {
            const defaultDb = storeContext.run('default', () => getDb());
            const stmt = defaultDb.prepare("DELETE FROM businesses WHERE id = ?");
            stmt.run(id);
        }
      } catch(e) {}"""

content = content.replace(old_del_db, new_del_db)


old_post_db1 = """          const defaultDb = storeContext.run('default', () => getDb());
          try {
            const stmt = defaultDb.prepare(`
              INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            // We just store db_name. The connect function will read db_config.json and replace the db name.
            stmt.run(id, name, 'postgres', '', '', dbNameForBusiness, '', '');
          } catch(e) {}"""

new_post_db1 = """          try {
            if (usePgMap['default'] && activePgPools['default']) {
                await activePgPools['default'].query(`
                  CREATE TABLE IF NOT EXISTS businesses (
                    id VARCHAR PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    db_type VARCHAR DEFAULT 'sqlite',
                    db_host VARCHAR,
                    db_port VARCHAR,
                    db_name VARCHAR,
                    db_user VARCHAR,
                    db_password VARCHAR
                  )
                `);
                await activePgPools['default'].query(`
                  INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [id, name, 'postgres', '', '', dbNameForBusiness, '', '']);
            } else {
                const defaultDb = storeContext.run('default', () => getDb());
                const stmt = defaultDb.prepare(`
                  INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `);
                stmt.run(id, name, 'postgres', '', '', dbNameForBusiness, '', '');
            }
          } catch(e) {}"""

content = content.replace(old_post_db1, new_post_db1)


old_post_db2 = """      // SQLite fallback
      const defaultDb = storeContext.run('default', () => getDb());
      try {
        const stmt = defaultDb.prepare(`
          INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, name, 'sqlite', '', '', '', '', '');
      } catch(e) {}"""

new_post_db2 = """      // SQLite fallback
      try {
        if (usePgMap['default'] && activePgPools['default']) {
            await activePgPools['default'].query(`
              CREATE TABLE IF NOT EXISTS businesses (
                id VARCHAR PRIMARY KEY,
                name VARCHAR NOT NULL,
                db_type VARCHAR DEFAULT 'sqlite',
                db_host VARCHAR,
                db_port VARCHAR,
                db_name VARCHAR,
                db_user VARCHAR,
                db_password VARCHAR
              )
            `);
            await activePgPools['default'].query(`
              INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [id, name, 'sqlite', '', '', '', '', '']);
        } else {
            const defaultDb = storeContext.run('default', () => getDb());
            const stmt = defaultDb.prepare(`
              INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            stmt.run(id, name, 'sqlite', '', '', '', '', '');
        }
      } catch(e) {}"""

content = content.replace(old_post_db2, new_post_db2)


with open('server.ts', 'w') as f:
    f.write(content)
