const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const imports = `
import { db } from './src/db';
import { checkbooks, issuedChecks, receivedChecks } from './src/db/schema';
import { eq, isNull } from 'drizzle-orm';
`;

// Insert imports after the first few imports
serverTs = serverTs.replace("import express from 'express';", imports + "import express from 'express';");

// Add specific API routes for the 3 tables before the generic /api/data routes
const specificRoutes = `
  // --- Check Management Drizzle APIs ---
  app.get('/api/data/checkbooks', async (req, res) => {
    try {
      const data = await db.select().from(checkbooks).where(isNull(checkbooks.deletedAt));
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/data/checkbooks', async (req, res) => {
    try {
      // The frontend currently sends the entire array for saving.
      // But if we want soft delete, we should only update or insert.
      // Actually, frontend sends array to replace.
      // If we are migrating to Drizzle, we should handle batch insert/update or just skip generic handling for these.
      // Let's create an endpoint that handles the frontend's array payload:
      const data = Array.isArray(req.body) ? req.body : [req.body];
      // For simplicity, we can upsert
      for (const item of data) {
         if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
         await db.insert(checkbooks).values({
           id: String(item.id),
           accountId: item.accountId ? String(item.accountId) : null,
           bankName: item.bankName || null,
           startNumber: item.startNumber || null,
           endNumber: item.endNumber || null,
           totalLeaves: item.totalLeaves ? parseInt(item.totalLeaves) : null,
           issuedDate: item.issuedDate ? new Date(item.issuedDate) : null,
         }).onConflictDoUpdate({
           target: checkbooks.id,
           set: {
             accountId: item.accountId ? String(item.accountId) : null,
             bankName: item.bankName || null,
             startNumber: item.startNumber || null,
             endNumber: item.endNumber || null,
             totalLeaves: item.totalLeaves ? parseInt(item.totalLeaves) : null,
             issuedDate: item.issuedDate ? new Date(item.issuedDate) : null,
             updatedAt: new Date(),
           }
         });
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
`;

// wait, the generic `app.get('/api/data/:key', ...)` already exists. Express matches routes in order!
// So if I put the specific routes BEFORE the generic ones, they will take precedence!

serverTs = serverTs.replace("app.get('/api/data/:key', async (req, res) => {", specificRoutes + "\n  app.get('/api/data/:key', async (req, res) => {");

fs.writeFileSync('server.ts', serverTs);
