import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  'setItems(parsed.items);',
  'setItems((parsed.items || []).map(i => ({ ...i, id: i.id || generateId() })));'
);
fs.writeFileSync('src/App.tsx', content);
