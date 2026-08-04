const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(
  /export const getIssuedChecks = async \(page\?: number, pageSize\?: number, sortBy\?: string, sortDir\?: string\) => \{/,
  "export const getIssuedChecks = async (page?: number, pageSize?: number, sortBy?: string, sortDir?: string) => {\n  let statusParam = '?status=all';"
);
file = file.replace(
  /let url = `\/api\/data\/issued_checks`;\n\s*if \(page && pageSize\) \{/,
  "let url = `/api/data/issued_checks?status=all`;\n  if (page && pageSize) {"
);
file = file.replace(
  /url \+= `\?page=\$\{page\}&pageSize=\$\{pageSize\}`/,
  "url = `/api/data/issued_checks?status=all&page=${page}&pageSize=${pageSize}`"
);

file = file.replace(
  /export const getReceivedChecks = async \(page\?: number, pageSize\?: number, sortBy\?: string, sortDir\?: string\) => \{/,
  "export const getReceivedChecks = async (page?: number, pageSize?: number, sortBy?: string, sortDir?: string) => {\n  let statusParam = '?status=all';"
);
file = file.replace(
  /let url = `\/api\/data\/received_checks`;\n\s*if \(page && pageSize\) \{/,
  "let url = `/api/data/received_checks?status=all`;\n  if (page && pageSize) {"
);
file = file.replace(
  /url \+= `\?page=\$\{page\}&pageSize=\$\{pageSize\}`/,
  "url = `/api/data/received_checks?status=all&page=${page}&pageSize=${pageSize}`"
);

fs.writeFileSync('src/services/accountingService.ts', file);
