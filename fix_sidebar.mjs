import fs from 'fs';
let code = fs.readFileSync('src/components/SidebarNavigation.tsx', 'utf8');
code = code.replace(
  /group\.items\.length/g,
  '(group.items || []).length'
);
code = code.replace(
  /group\.items\.filter/g,
  '(group.items || []).filter'
);
fs.writeFileSync('src/components/SidebarNavigation.tsx', code);
