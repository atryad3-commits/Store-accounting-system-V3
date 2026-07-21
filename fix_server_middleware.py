with open('server.ts', 'r') as f:
    content = f.read()

middleware = """  app.use((req, res, next) => {
    const storeId = req.headers['x-store-id'] || 'default';
    storeContext.run(storeId as string, () => {
      next();
    });
  });
"""

if 'storeContext.run' not in content:
    content = content.replace("  app.use(cookieParser());", "  app.use(cookieParser());\n" + middleware)

with open('server.ts', 'w') as f:
    f.write(content)
