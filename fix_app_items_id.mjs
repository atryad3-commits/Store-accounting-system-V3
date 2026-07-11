import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  'setItems(inv.items.map((i: any) => ({ ...i })));',
  'setItems((inv.items || []).map((i: any) => ({ ...i, id: i.id || generateId() })));'
);
fs.writeFileSync('src/App.tsx', content);
