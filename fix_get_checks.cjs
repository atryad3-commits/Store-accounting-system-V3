const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// For issued checks
file = file.replace(
  /let query = db\.select\(\)\.from\(issuedChecks\)\.where\(and\(isNull\(issuedChecks\.deletedAt\), or\(eq\(issuedChecks\.approvalStatus, 'approved'\), isNull\(issuedChecks\.approvalStatus\)\)\)\);/g,
  `let query = db.select().from(issuedChecks).where(isNull(issuedChecks.deletedAt));
      if (req.query.status !== 'all') {
         query = query.where(and(isNull(issuedChecks.deletedAt), or(eq(issuedChecks.approvalStatus, 'approved'), isNull(issuedChecks.approvalStatus))));
      }`
);

file = file.replace(
  /const countRes = await db\.select\(\{ count: sql\`count\(\*\)\`\.mapWith\(Number\) \}\)\.from\(issuedChecks\)\.where\(and\(isNull\(issuedChecks\.deletedAt\), or\(eq\(issuedChecks\.approvalStatus, 'approved'\), isNull\(issuedChecks\.approvalStatus\)\)\)\);/,
  `let countQuery = db.select({ count: sql\`count(*)\`.mapWith(Number) }).from(issuedChecks).where(isNull(issuedChecks.deletedAt));
         if (req.query.status !== 'all') {
            countQuery = db.select({ count: sql\`count(*)\`.mapWith(Number) }).from(issuedChecks).where(and(isNull(issuedChecks.deletedAt), or(eq(issuedChecks.approvalStatus, 'approved'), isNull(issuedChecks.approvalStatus))));
         }
         const countRes = await countQuery;`
);


// For received checks
file = file.replace(
  /let query = db\.select\(\)\.from\(receivedChecks\)\.where\(and\(isNull\(receivedChecks\.deletedAt\), or\(eq\(receivedChecks\.approvalStatus, 'approved'\), isNull\(receivedChecks\.approvalStatus\)\)\)\);/g,
  `let query = db.select().from(receivedChecks).where(isNull(receivedChecks.deletedAt));
      if (req.query.status !== 'all') {
         query = query.where(and(isNull(receivedChecks.deletedAt), or(eq(receivedChecks.approvalStatus, 'approved'), isNull(receivedChecks.approvalStatus))));
      }`
);

file = file.replace(
  /const countRes = await db\.select\(\{ count: sql\`count\(\*\)\`\.mapWith\(Number\) \}\)\.from\(receivedChecks\)\.where\(and\(isNull\(receivedChecks\.deletedAt\), or\(eq\(receivedChecks\.approvalStatus, 'approved'\), isNull\(receivedChecks\.approvalStatus\)\)\)\);/,
  `let countQuery = db.select({ count: sql\`count(*)\`.mapWith(Number) }).from(receivedChecks).where(isNull(receivedChecks.deletedAt));
         if (req.query.status !== 'all') {
            countQuery = db.select({ count: sql\`count(*)\`.mapWith(Number) }).from(receivedChecks).where(and(isNull(receivedChecks.deletedAt), or(eq(receivedChecks.approvalStatus, 'approved'), isNull(receivedChecks.approvalStatus))));
         }
         const countRes = await countQuery;`
);

fs.writeFileSync('server.ts', file);
