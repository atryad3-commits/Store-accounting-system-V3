const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('import { z } from "zod"')) {
    content = content.replace(`import jwt from 'jsonwebtoken';`, `import jwt from 'jsonwebtoken';\nimport { z } from "zod";`);
    
    // Add validation to login
    const loginValidation = `
  const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(4),
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      loginSchema.parse(req.body);
    } catch (e) {
      return res.status(400).json({ error: 'داده‌های ورودی نامعتبر است', details: e.errors });
    }
`;

    content = content.replace(`  app.post('/api/auth/login', async (req, res) => {`, loginValidation);
    
    fs.writeFileSync('server.ts', content);
    console.log("Added Zod validation to login");
}
