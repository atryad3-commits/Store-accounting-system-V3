import sys
with open('server.ts', 'r') as f:
    content = f.read()

demo = """  app.post('/api/generate_demo_data', async (req, res) => {
    res.json({ success: true, message: 'Demo data generation not available in this environment.' });
  });"""

content = content.replace(demo, "")
content = content.replace("app.get('/api/databases', async (req, res) => {", demo + "\n\n  app.get('/api/databases', async (req, res) => {")

with open('server.ts', 'w') as f:
    f.write(content)
