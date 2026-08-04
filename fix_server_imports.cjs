const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(/import { eq, or, desc, isNull, and, ilike, sql as dSql } from 'drizzle-orm';/, "import { eq, or, desc, asc, isNull, and, ilike, sql } from 'drizzle-orm';");
// It seems the original file might not have that exact line. Let's find it:
