import sys

with open('server.ts', 'r') as f:
    content = f.read()

old_config = """      const config = { engine: 'postgres', connectionString: finalConnectionString };
      await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
      
      // Try to re-init DB with new connection
      getActivePgPool() = await connectPgDb(finalConnectionString);
      isPgActive() = true;"""

new_config = """      const config = { engine: 'postgres', connectionString: finalConnectionString };
      await fsPromises.writeFile(DB_CONFIG_FILE, JSON.stringify(config));
      
      // Try to re-init DB with new connection
      activePgPools['default'] = await connectPgDb(finalConnectionString);
      usePgMap['default'] = true;"""

content = content.replace(old_config, new_config)

with open('server.ts', 'w') as f:
    f.write(content)
