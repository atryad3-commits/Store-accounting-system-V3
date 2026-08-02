const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');
const activeTabLines = lines.filter(l => l.includes('activeTab'));
console.log(activeTabLines.slice(0, 20).join('\n'));
