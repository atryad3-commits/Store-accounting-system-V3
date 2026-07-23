const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /activeTab === "(.*?)" \? \(\s*([\s\S]*?)\s*\) :/g;
let match;
let routes = [];

while ((match = regex.exec(content)) !== null) {
  routes.push({ tab: match[1], comp: match[2].trim() });
}

console.log(routes.map(r => `<Route path="/${r.tab}" element={${r.comp}} />`).join('\n'));
