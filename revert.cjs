const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/<Suspense fallback=\{<div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"><\/div><\/div>\}><Routes>\n<Route path="\/([^"]+)" element={<>/g, '{activeTab === "$1" ? (');

content = content.replace(/<\/\>} \/>\n<Route path="\/([^"]+)" element={<>/g, ') : activeTab === "$1" ? (');

content = content.replace(/<\/\>} \/>\n<Route path="\*" element=\{<Navigate to="\/welcome_page" replace \/>\} \/>\n<\/Routes><\/Suspense>/g, ') : null}');

const importRegex = /const ([A-Z][a-zA-Z0-9_]*) = React\.lazy\(\(\) => import\('([^']+)'\)\);/g;
let match;
while ((match = importRegex.exec(content)) !== null) {
  content = content.replace(match[0], `import ${match[1]} from '${match[2]}';`);
}

fs.writeFileSync('src/App.tsx', content);
