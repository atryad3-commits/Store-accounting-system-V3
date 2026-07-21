import sys

with open('server.ts', 'r') as f:
    content = f.read()

old_config = """      if (engine === 'sqlite' || connectionString === 'sqlite') {
         const config = { engine: 'sqlite' };
         await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
         isPgActive() = false;
         getActivePgPool() = null;
         return res.json({ success: true });
      }"""

new_config = """      if (engine === 'sqlite' || connectionString === 'sqlite') {
         const config = { engine: 'sqlite' };
         await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
         activePgPools['default'] = null;
         usePgMap['default'] = false;
         return res.json({ success: true });
      }"""

content = content.replace(old_config, new_config)

with open('server.ts', 'w') as f:
    f.write(content)
