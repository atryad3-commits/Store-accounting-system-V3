const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const summaryEndpoint = `
  app.get('/api/checks/summary', async (req, res) => {
    try {
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

      res.json({ issuedStats, receivedStats });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

`;

file = file.replace(
  "app.get('/api/data/issued_checks', async (req, res) => {",
  summaryEndpoint + "app.get('/api/data/issued_checks', async (req, res) => {"
);

const paginatedIssuedChecks = `app.get('/api/data/issued_checks', async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.pageSize);
      const sortBy = req.query.sortBy;
      const sortDir = req.query.sortDir;

      let query = db.select().from(issuedChecks).where(isNull(issuedChecks.deletedAt));

      if (sortBy && issuedChecks[sortBy]) {
         const dir = sortDir === 'asc' ? asc : desc;
         query = query.orderBy(dir(issuedChecks[sortBy]));
      } else {
         query = query.orderBy(desc(issuedChecks.createdAt));
      }

      if (page && pageSize) {
         const offset = (page - 1) * pageSize;
         const countRes = await db.select({ count: sql\`count(*)\`.mapWith(Number) }).from(issuedChecks).where(isNull(issuedChecks.deletedAt));
         const totalCount = countRes[0].count;
         
         query = query.limit(pageSize).offset(offset);
         const data = await query;
         return res.json({ data, totalCount, page, pageSize });
      }

      const data = await query;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });`;

file = file.replace(/app\.get\('\/api\/data\/issued_checks', async \(req, res\) => {[\s\S]*?res\.status\(500\)\.json\({ error: err\.message }\);\n    }\n  }\);/, paginatedIssuedChecks);

const paginatedReceivedChecks = `app.get('/api/data/received_checks', async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.pageSize);
      const sortBy = req.query.sortBy;
      const sortDir = req.query.sortDir;

      let query = db.select().from(receivedChecks).where(isNull(receivedChecks.deletedAt));

      if (sortBy && receivedChecks[sortBy]) {
         const dir = sortDir === 'asc' ? asc : desc;
         query = query.orderBy(dir(receivedChecks[sortBy]));
      } else {
         query = query.orderBy(desc(receivedChecks.createdAt));
      }

      if (page && pageSize) {
         const offset = (page - 1) * pageSize;
         const countRes = await db.select({ count: sql\`count(*)\`.mapWith(Number) }).from(receivedChecks).where(isNull(receivedChecks.deletedAt));
         const totalCount = countRes[0].count;
         
         query = query.limit(pageSize).offset(offset);
         const data = await query;
         return res.json({ data, totalCount, page, pageSize });
      }

      const data = await query;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });`;

file = file.replace(/app\.get\('\/api\/data\/received_checks', async \(req, res\) => {[\s\S]*?res\.status\(500\)\.json\({ error: err\.message }\);\n    }\n  }\);/, paginatedReceivedChecks);

fs.writeFileSync('server.ts', file);
