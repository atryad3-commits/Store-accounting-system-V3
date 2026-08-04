const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const auditRoute = `
  app.get('/api/data/check_audit_logs', async (req, res) => {
    try {
      const { checkId, checkType } = req.query;
      // Drizzle doesn't have deletedAt for audit logs because they are immutable
      const data = await db.select().from(checkAuditLogs);
      // Wait, we need to import checkAuditLogs
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/data/check_audit_logs', async (req, res) => {
    try {
      const data = Array.isArray(req.body) ? req.body : [req.body];
      for (const item of data) {
         if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
         await db.insert(checkAuditLogs).values({
           id: String(item.id),
           checkId: String(item.checkId),
           checkType: String(item.checkType),
           action: item.action || null,
           oldValues: item.oldValues || null,
           newValues: item.newValues || null,
           userId: item.userId ? String(item.userId) : null,
           createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
         }); // No onConflictDoUpdate, it's immutable
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
`;

file = file.replace(/import { checkbooks, issuedChecks, receivedChecks } from '\.\/src\/db\/schema';/g, "import { checkbooks, issuedChecks, receivedChecks, checkAuditLogs } from './src/db/schema';");
file = file.replace("app.get('/api/data/:key', async (req, res) => {", auditRoute + "\n  app.get('/api/data/:key', async (req, res) => {");

fs.writeFileSync('server.ts', file);
