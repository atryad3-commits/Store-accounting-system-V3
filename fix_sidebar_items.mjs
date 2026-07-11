import fs from 'fs';
let content = fs.readFileSync('src/components/SidebarNavigation.tsx', 'utf8');
content = content.replace(/\(group\.items\)\.length/g, '(group.items || []).length');
fs.writeFileSync('src/components/SidebarNavigation.tsx', content);
