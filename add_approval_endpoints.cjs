const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const approvalEndpoints = `
  app.post('/api/data/checks/:type/:id/approve', async (req, res) => {
    try {
      const { type, id } = req.params;
      const table = type === 'issued' ? issuedChecks : receivedChecks;
      const userId = req.user?.id || req.user?.username || 'system';
      const role = req.user?.role;
      
      if (role !== 'admin' && role !== 'manager' && role !== 'financial_manager') {
         return res.status(403).json({ error: 'عدم دسترسی. فقط مدیر مالی می‌تواند تأیید کند.' });
      }

      const check = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (check.length === 0) return res.status(404).json({ error: 'چک یافت نشد' });
      
      if (check[0].creatorId === userId) {
         return res.status(403).json({ error: 'شما نمی‌توانید چکی که خودتان ثبت کرده‌اید را تأیید کنید.' });
      }
      
      await db.update(table).set({
         approvalStatus: 'approved',
         approvedById: userId,
         approvedAt: new Date()
      }).where(eq(table.id, id));
      
      res.json({ success: true, message: 'چک با موفقیت تأیید شد' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'خطای سرور' });
    }
  });

  app.post('/api/data/checks/:type/:id/reject', async (req, res) => {
    try {
      const { type, id } = req.params;
      const table = type === 'issued' ? issuedChecks : receivedChecks;
      const userId = req.user?.id || req.user?.username || 'system';
      const role = req.user?.role;
      
      if (role !== 'admin' && role !== 'manager' && role !== 'financial_manager') {
         return res.status(403).json({ error: 'عدم دسترسی' });
      }

      await db.update(table).set({
         approvalStatus: 'rejected',
         approvedById: userId,
         approvedAt: new Date()
      }).where(eq(table.id, id));
      
      res.json({ success: true, message: 'چک رد شد' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'خطای سرور' });
    }
  });
`;

file = file.replace(/app\.get\('\/api\/data\/issued_checks'/, approvalEndpoints + "\n  app.get('/api/data/issued_checks'");

fs.writeFileSync('server.ts', file);
