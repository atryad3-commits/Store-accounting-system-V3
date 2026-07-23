const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target = `  app.post('/api/data/batch', async (req, res) => {
    const { operations } = req.body;
    if (!Array.isArray(operations)) {
      return res.status(400).json({ error: 'Expected operations array' });
    }
        
    try {`;

const replacement = `  app.post('/api/data/batch', async (req, res) => {
    const { operations } = req.body;
    if (!Array.isArray(operations)) {
      return res.status(400).json({ error: 'Expected operations array' });
    }
    
    for (const op of operations) {
      if ((op.type === 'append' || op.type === 'update') && op.data) {
        const validationResult = validateData(op.key, op.data);
        if (!validationResult.success) {
          return res.status(400).json({ error: 'Validation failed in batch', key: op.key, details: validationResult.error.errors });
        }
      }
    }
        
    try {`;

content = content.replace(target, replacement);
fs.writeFileSync('server.ts', content);
console.log('Patched batch route');
