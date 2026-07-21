import sys

with open('server.ts', 'r') as f:
    content = f.read()

old_mig = """      const hasSqliteData = getDb().prepare('SELECT count(*) as count FROM store').get() as any;
      if (parseInt(res.rows[0].count) === 0 && hasSqliteData && hasSqliteData.count > 0) {
        // Only migrate if Postgres has no users AND SQLite has data. To prevent accidental data wipe, we don't drop tables.
        console.log('Migrating from SQLite to Postgres...');
        tableSchemas.clear();
        const sqliteRows = getDb().prepare('SELECT key, value FROM store').all();"""

new_mig = """      const hasSqliteData = getDb().prepare('SELECT count(*) as count FROM store').get() as any;
      if (parseInt(res.rows[0].count) === 0 && hasSqliteData && hasSqliteData.count > 0) {
        // Only migrate if Postgres has no users AND SQLite has data. To prevent accidental data wipe, we don't drop tables.
        console.log('Migrating from SQLite to Postgres...');
        
        try {
            const storeId = storeContext.getStore() || 'default';
            if (storeId === 'default') {
                const businesses = getDb().prepare('SELECT * FROM businesses').all();
                if (businesses.length > 0) {
                    await getActivePgPool().query(`
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
                    for (const b of businesses) {
                        await getActivePgPool().query(`
                          INSERT INTO businesses (id, name, db_type, db_host, db_port, db_name, db_user, db_password)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT(id) DO NOTHING
                        `, [b.id, b.name, b.db_type, b.db_host, b.db_port, b.db_name, b.db_user, b.db_password]);
                    }
                }
            }
        } catch(e) {}
        
        tableSchemas.clear();
        const sqliteRows = getDb().prepare('SELECT key, value FROM store').all();"""

content = content.replace(old_mig, new_mig)

with open('server.ts', 'w') as f:
    f.write(content)
