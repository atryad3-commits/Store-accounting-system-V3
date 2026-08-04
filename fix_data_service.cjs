const fs = require('fs');
let file = fs.readFileSync('src/services/dataService.ts', 'utf8');

const getChecksSummaryStr = `
export const getChecksSummary = async () => {
  const res = await fetch('/api/checks/summary', {
    headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''),
               'x-store-id': localStorage.getItem('activeStoreId') || 'default' }
  });
  if (!res.ok) throw new Error('Failed to fetch checks summary');
  return res.json();
};
`;

if (!file.includes('getChecksSummary')) {
  file = file + getChecksSummaryStr;
}

fs.writeFileSync('src/services/dataService.ts', file);
