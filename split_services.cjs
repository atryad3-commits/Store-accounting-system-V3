const fs = require('fs');

const content = fs.readFileSync('src/services/dataService.ts', 'utf8');

// Find all exports
const exportRegex = /export const (\w+)\s*=/g;
let match;
const exportsList = [];
while ((match = exportRegex.exec(content)) !== null) {
  exportsList.push(match[1]);
}
console.log("Found exports:", exportsList.length);
