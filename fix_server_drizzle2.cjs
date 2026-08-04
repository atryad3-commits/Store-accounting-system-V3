const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const additionalRoutes = `
  app.get('/api/data/issued_checks', async (req, res) => {
    try {
      const data = await db.select().from(issuedChecks).where(isNull(issuedChecks.deletedAt));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/data/issued_checks', async (req, res) => {
    try {
      const data = Array.isArray(req.body) ? req.body : [req.body];
      for (const item of data) {
         if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
         await db.insert(issuedChecks).values({
           id: String(item.id),
           checkbookId: item.checkbookId ? String(item.checkbookId) : null,
           checkNumber: String(item.checkNumber || item.id),
           amount: String(item.amount || 0),
           issueDate: item.issueDate ? new Date(item.issueDate) : null,
           dueDate: item.dueDate ? new Date(item.dueDate) : null,
           payeeId: item.payeeId ? String(item.payeeId) : null,
           status: item.status || 'blank',
           receiptNumber: item.receiptNumber || null,
           assignedToId: item.assignedToId ? String(item.assignedToId) : null,
           bankAccountId: item.bankAccountId ? String(item.bankAccountId) : null,
           description: item.description || null,
           imageUrl: item.imageUrl || null,
         }).onConflictDoUpdate({
           target: issuedChecks.id,
           set: {
             checkbookId: item.checkbookId ? String(item.checkbookId) : null,
             checkNumber: String(item.checkNumber || item.id),
             amount: String(item.amount || 0),
             issueDate: item.issueDate ? new Date(item.issueDate) : null,
             dueDate: item.dueDate ? new Date(item.dueDate) : null,
             payeeId: item.payeeId ? String(item.payeeId) : null,
             status: item.status || 'blank',
             receiptNumber: item.receiptNumber || null,
             assignedToId: item.assignedToId ? String(item.assignedToId) : null,
             bankAccountId: item.bankAccountId ? String(item.bankAccountId) : null,
             description: item.description || null,
             imageUrl: item.imageUrl || null,
             updatedAt: new Date(),
           }
         });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/data/received_checks', async (req, res) => {
    try {
      const data = await db.select().from(receivedChecks).where(isNull(receivedChecks.deletedAt));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/data/received_checks', async (req, res) => {
    try {
      const data = Array.isArray(req.body) ? req.body : [req.body];
      for (const item of data) {
         if (!item.id) item.id = Math.random().toString(36).substring(2, 15);
         await db.insert(receivedChecks).values({
           id: String(item.id),
           checkNumber: String(item.checkNumber || item.id),
           bankName: item.bankName || null,
           branchName: item.branchName || null,
           amount: String(item.amount || 0),
           receiveDate: item.receiveDate ? new Date(item.receiveDate) : null,
           dueDate: item.dueDate ? new Date(item.dueDate) : null,
           payerId: item.payerId ? String(item.payerId) : null,
           status: item.status || 'received',
           receiptNumber: item.receiptNumber || null,
           assignedToId: item.assignedToId ? String(item.assignedToId) : null,
           accountId: item.accountId ? String(item.accountId) : null,
           description: item.description || null,
         }).onConflictDoUpdate({
           target: receivedChecks.id,
           set: {
             checkNumber: String(item.checkNumber || item.id),
             bankName: item.bankName || null,
             branchName: item.branchName || null,
             amount: String(item.amount || 0),
             receiveDate: item.receiveDate ? new Date(item.receiveDate) : null,
             dueDate: item.dueDate ? new Date(item.dueDate) : null,
             payerId: item.payerId ? String(item.payerId) : null,
             status: item.status || 'received',
             receiptNumber: item.receiptNumber || null,
             assignedToId: item.assignedToId ? String(item.assignedToId) : null,
             accountId: item.accountId ? String(item.accountId) : null,
             description: item.description || null,
             updatedAt: new Date(),
           }
         });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
`;

serverTs = serverTs.replace("app.get('/api/data/:key', async (req, res) => {", additionalRoutes + "\n  app.get('/api/data/:key', async (req, res) => {");

fs.writeFileSync('server.ts', serverTs);
