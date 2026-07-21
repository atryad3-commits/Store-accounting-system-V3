import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace the part inside /api/databases
old_code = """      const mergedMap = new Map();
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

      res.json({ success: true, databases: Array.from(mergedMap.values()) });"""

new_code = """      const mergedMap = new Map();
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

      // Ensure 'default' store is correctly represented
      if (!mergedMap.has('default')) {
          mergedMap.set('default', {
              id: 'default',
              name: 'کسب و کار اصلی',
              db_type: usePgMap['default'] ? 'postgres' : 'sqlite'
          });
      } else {
          const def = mergedMap.get('default');
          if (usePgMap['default']) {
              def.db_type = 'postgres';
          }
          if (def.name === 'فروشگاه اصلی') {
              def.name = 'کسب و کار اصلی';
          }
          mergedMap.set('default', def);
      }

      res.json({ success: true, databases: Array.from(mergedMap.values()) });"""

content = content.replace(old_code, new_code)

with open('server.ts', 'w') as f:
    f.write(content)
