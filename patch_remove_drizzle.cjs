const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('// --- Check Management Drizzle APIs ---'));
const endIdx = lines.findIndex(l => l.includes("app.get('/api/data/:key', async (req, res) => {"));

if (startIdx !== -1 && endIdx !== -1) {
    lines.splice(startIdx, endIdx - startIdx);
    fs.writeFileSync('server.ts', lines.join('\n'));
    console.log('Removed Drizzle APIs');
} else {
    console.log('Could not find bounds');
}
