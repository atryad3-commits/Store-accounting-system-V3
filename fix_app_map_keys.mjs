import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<tr key={prod.id} className="break-inside-avoid">',
  '<tr key={prod.id || idx} className="break-inside-avoid">'
);

content = content.replace(
  '<div\n                                key={fmt.id}',
  '<div\n                                key={fmt.id || `fmt-${Math.random()}`}'
);

content = content.replace(
  '<option key={cat.id} value={cat.id}>',
  '<option key={cat.id || `cat-${Math.random()}`} value={cat.id}>'
);

content = content.replace(
  '<option key={wh.id} value={wh.id}>',
  '<option key={wh.id || `wh-${Math.random()}`} value={wh.id}>'
);

content = content.replace(
  '<div\n                                              key={entry.id}',
  '<div\n                                              key={entry.id || `entry-${idx}`}'
);

fs.writeFileSync('src/App.tsx', content);
