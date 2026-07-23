const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const validationImport = `import { validateData } from './src/schemas/validation';\n`;

// Insert the import near the top if not present
if (!content.includes('import { validateData }')) {
  content = content.replace(`import { z } from "zod";`, `import { z } from "zod";\n${validationImport}`);
}

const appendRouteTarget = `  app.post('/api/data/:key/append', async (req, res) => {
    const { key } = req.params;
    const newItem = req.body;
    try {`;

const appendRouteReplacement = `  app.post('/api/data/:key/append', async (req, res) => {
    const { key } = req.params;
    const newItem = req.body;
    
    // Zod Validation
    const validationResult = validateData(key, newItem);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: validationResult.error.errors });
    }

    try {`;

content = content.replace(appendRouteTarget, appendRouteReplacement);

const listRouteTarget = `  app.post('/api/data/:key', async (req, res) => {
    const { key } = req.params;
    const data = req.body;

    // Do not log changes to system_logs themselves
    if (key !== 'system_logs' && Array.isArray(data)) {`;

const listRouteReplacement = `  app.post('/api/data/:key', async (req, res) => {
    const { key } = req.params;
    const data = req.body;

    // Zod Validation
    if (key !== 'system_logs') {
      const validationResult = validateData(key, data);
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Validation failed', details: validationResult.error.errors });
      }
    }

    // Do not log changes to system_logs themselves
    if (key !== 'system_logs' && Array.isArray(data)) {`;

content = content.replace(listRouteTarget, listRouteReplacement);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with Zod validation");
