const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

file = file.replace(
  /const qs = new URLSearchParams\(\{ page: issuedPage, pageSize, sortBy: filters\.issuedSortBy, sortDir: filters\.issuedSortDir \}\)\.toString\(\);/,
  "const qs = new URLSearchParams({ page: issuedPage, pageSize, sortBy: filters.issuedSortBy, sortDir: filters.issuedSortDir, status: 'all' }).toString();"
);

file = file.replace(
  /const qs = new URLSearchParams\(\{ page: receivedPage, pageSize, sortBy: filters\.receivedSortBy, sortDir: filters\.receivedSortDir \}\)\.toString\(\);/,
  "const qs = new URLSearchParams({ page: receivedPage, pageSize, sortBy: filters.receivedSortBy, sortDir: filters.receivedSortDir, status: 'all' }).toString();"
);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
