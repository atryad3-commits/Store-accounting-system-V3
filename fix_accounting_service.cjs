const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(
  /export const getIssuedChecks = async \(page\?: number, pageSize\?: number, sortBy\?: string, sortDir\?: string\) => \{([\s\S]*?)const query: any = \{\};/,
  `export const getIssuedChecks = async (page?: number, pageSize?: number, sortBy?: string, sortDir?: string) => {
  const query: any = { status: 'all' };`
);

file = file.replace(
  /export const getReceivedChecks = async \(page\?: number, pageSize\?: number, sortBy\?: string, sortDir\?: string\) => \{([\s\S]*?)const query: any = \{\};/,
  `export const getReceivedChecks = async (page?: number, pageSize?: number, sortBy?: string, sortDir?: string) => {
  const query: any = { status: 'all' };`
);

fs.writeFileSync('src/services/accountingService.ts', file);
