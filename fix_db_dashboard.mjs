import fs from 'fs';
let code = fs.readFileSync('src/components/admin/DatabaseDashboard.tsx', 'utf8');
code = code.replace(
  /\<React\.Fragment key=\{item\.id \|\| index\}\>/g,
  '<React.Fragment key={item.id ? `rec-${item.id}-${index}` : `idx-${index}`}>'
);
fs.writeFileSync('src/components/admin/DatabaseDashboard.tsx', code);
