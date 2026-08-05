const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const codeToInsert = `
  app.get('/api/data/cashflow-forecast', async (req, res) => {
    try {
      const days = parseInt(req.query.days || '30', 10);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + days);

      // 1. Get total current liquidity
      const allAccounts = await db.select().from(schema.accounts);
      const allCashboxes = await db.select().from(schema.cashboxes);
      
      let initialBalance = 0;
      allAccounts.forEach(a => initialBalance += Number(a.balance || 0));
      allCashboxes.forEach(c => initialBalance += Number(c.balance || 0));

      // 2. Get pending issued checks
      const pendingIssued = await db.select().from(schema.issuedChecks).where(
        and(
          eq(schema.issuedChecks.status, 'issued'),
          isNull(schema.issuedChecks.deletedAt)
        )
      );

      // 3. Get pending received checks
      const pendingReceived = await db.select().from(schema.receivedChecks).where(
        and(
          inArray(schema.receivedChecks.status, ['received', 'deposited']),
          isNull(schema.receivedChecks.deletedAt)
        )
      );

      // Group by date
      const forecastMap = new Map(); // "YYYY-MM-DD" -> { inflow, outflow }
      
      for (let i = 0; i <= days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        forecastMap.set(d.toISOString().split('T')[0], { inflow: 0, outflow: 0, date: d });
      }

      pendingIssued.forEach(check => {
        if (check.dueDate) {
          const d = new Date(check.dueDate);
          d.setHours(0,0,0,0);
          if (d >= today && d <= targetDate) {
             const key = d.toISOString().split('T')[0];
             if (forecastMap.has(key)) {
               forecastMap.get(key).outflow += Number(check.amount);
             }
          }
        }
      });

      pendingReceived.forEach(check => {
        if (check.dueDate) {
          const d = new Date(check.dueDate);
          d.setHours(0,0,0,0);
          if (d >= today && d <= targetDate) {
             const key = d.toISOString().split('T')[0];
             if (forecastMap.has(key)) {
               forecastMap.get(key).inflow += Number(check.amount);
             }
          }
        }
      });

      const forecastArray = Array.from(forecastMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
      
      let runningBalance = initialBalance;
      const result = forecastArray.map(item => {
        runningBalance = runningBalance + item.inflow - item.outflow;
        return {
          date: item.date.toISOString(),
          dateKey: item.date.toISOString().split('T')[0],
          inflow: item.inflow,
          outflow: item.outflow,
          net: item.inflow - item.outflow,
          runningBalance
        };
      });

      res.json({ success: true, initialBalance, forecast: result });
    } catch (error) {
      console.error('Error fetching cashflow forecast:', error);
      res.status(500).json({ error: 'Failed to fetch cashflow forecast' });
    }
  });
`;

file = file.replace(
  /app\.get\('\/api\/data\/issued_checks', async \(req, res\) => \{/,
  codeToInsert + "\n  app.get('/api/data/issued_checks', async (req, res) => {"
);

// We also need `inArray` from drizzle-orm if it's not imported.
// Let's check imports in server.ts
if (!file.includes('inArray')) {
   file = file.replace(/import \{ eq, isNull, sql, desc, asc /g, 'import { eq, isNull, sql, desc, asc, inArray ');
}

fs.writeFileSync('server.ts', file);
