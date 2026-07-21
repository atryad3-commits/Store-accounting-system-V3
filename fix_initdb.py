with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("  db = new DatabaseSync(SQLITE_FILE);", "")

with open('server.ts', 'w') as f:
    f.write(content)
