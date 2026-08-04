const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(/app\.post\('\/api\/data\/issued_checks', async \(req, res\) => {\n    try {\n      const data/g, 
  "app.post('/api/data/issued_checks', async (req, res) => {\n    const validation = validateData('issued_checks', req.body);\n    if (!validation.success) {\n      return res.status(400).json({ error: 'Validation failed', details: validation.error.errors });\n    }\n    try {\n      const data");

file = file.replace(/app\.post\('\/api\/data\/received_checks', async \(req, res\) => {\n    try {\n      const data/g, 
  "app.post('/api/data/received_checks', async (req, res) => {\n    const validation = validateData('received_checks', req.body);\n    if (!validation.success) {\n      return res.status(400).json({ error: 'Validation failed', details: validation.error.errors });\n    }\n    try {\n      const data");

fs.writeFileSync('server.ts', file);
