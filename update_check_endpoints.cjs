const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// For GET /api/data/issued_checks
file = file.replace(
  /let query = db\.select\(\)\.from\(issuedChecks\)\.where\(isNull\(issuedChecks\.deletedAt\)\);/,
  "let query = db.select().from(issuedChecks).where(and(isNull(issuedChecks.deletedAt), or(eq(issuedChecks.approvalStatus, 'approved'), isNull(issuedChecks.approvalStatus))));"
);
file = file.replace(
  /const countRes = await db\.select\(\{ count: sql\`count\(\*\)\`\.mapWith\(Number\) \}\)\.from\(issuedChecks\)\.where\(isNull\(issuedChecks\.deletedAt\)\);/,
  "const countRes = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(issuedChecks).where(and(isNull(issuedChecks.deletedAt), or(eq(issuedChecks.approvalStatus, 'approved'), isNull(issuedChecks.approvalStatus))));"
);

// For GET /api/data/received_checks
file = file.replace(
  /let query = db\.select\(\)\.from\(receivedChecks\)\.where\(isNull\(receivedChecks\.deletedAt\)\);/,
  "let query = db.select().from(receivedChecks).where(and(isNull(receivedChecks.deletedAt), or(eq(receivedChecks.approvalStatus, 'approved'), isNull(receivedChecks.approvalStatus))));"
);
file = file.replace(
  /const countRes = await db\.select\(\{ count: sql\`count\(\*\)\`\.mapWith\(Number\) \}\)\.from\(receivedChecks\)\.where\(isNull\(receivedChecks\.deletedAt\)\);/,
  "const countRes = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(receivedChecks).where(and(isNull(receivedChecks.deletedAt), or(eq(receivedChecks.approvalStatus, 'approved'), isNull(receivedChecks.approvalStatus))));"
);

fs.writeFileSync('server.ts', file);
