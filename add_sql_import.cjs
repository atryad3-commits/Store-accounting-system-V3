const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(/import { eq, isNull } from 'drizzle-orm';/, "import { eq, isNull, sql, desc, asc } from 'drizzle-orm';");

// And let's add simple cache to summary endpoint
const cacheCode = `
  let checksSummaryCache = null;
  let checksSummaryCacheTime = 0;
  const CACHE_TTL = 30000;

  app.get('/api/checks/summary', async (req, res) => {
    try {
      if (checksSummaryCache && Date.now() - checksSummaryCacheTime < CACHE_TTL) {
        return res.json(checksSummaryCache);
      }
      const issuedStats = await db.select({
        status: issuedChecks.status,
        totalAmount: sql\`sum(\${issuedChecks.amount}::numeric)\`.mapWith(Number),
        count: sql\`count(*)\`.mapWith(Number)
      }).from(issuedChecks)
        .where(isNull(issuedChecks.deletedAt))
        .groupBy(issuedChecks.status);

      const receivedStats = await db.select({
        status: receivedChecks.status,
        totalAmount: sql\`sum(\${receivedChecks.amount}::numeric)\`.mapWith(Number),
        count: sql\`count(*)\`.mapWith(Number)
      }).from(receivedChecks)
        .where(isNull(receivedChecks.deletedAt))
        .groupBy(receivedChecks.status);

      checksSummaryCache = { issuedStats, receivedStats };
      checksSummaryCacheTime = Date.now();
      res.json(checksSummaryCache);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
`;

file = file.replace(/app\.get\('\/api\/checks\/summary', async \(req, res\) => {[\s\S]*?res\.status\(500\)\.json\({ error: err\.message }\);\n    }\n  }\);/, cacheCode);

// Also invalidate cache on POST/PUT issued_checks or received_checks
file = file.replace(/app\.post\('\/api\/data\/issued_checks', async \(req, res\) => {/g, "app.post('/api/data/issued_checks', async (req, res) => {\n    checksSummaryCache = null;");
file = file.replace(/app\.post\('\/api\/data\/received_checks', async \(req, res\) => {/g, "app.post('/api/data/received_checks', async (req, res) => {\n    checksSummaryCache = null;");


fs.writeFileSync('server.ts', file);
