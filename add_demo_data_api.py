import sys
with open('server.ts', 'r') as f:
    content = f.read()

api = """  app.post('/api/generate_demo_data', async (req, res) => {
    res.json({ success: true, message: 'Demo data generation not available in this environment.' });
  });
"""
if "generate_demo_data" not in content:
    content = content.replace("app.listen(PORT", api + "\n  app.listen(PORT")
    with open('server.ts', 'w') as f:
        f.write(content)
