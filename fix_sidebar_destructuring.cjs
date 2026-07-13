const fs = require('fs');
let content = fs.readFileSync('src/components/SidebarNavigation.tsx', 'utf-8');

content = content.replace(
  '  setExpandedGroups,\n}: SidebarNavigationProps)',
  '  setExpandedGroups,\n  setIsReceiveModalOpen,\n  setIsPayModalOpen,\n}: SidebarNavigationProps)'
);

fs.writeFileSync('src/components/SidebarNavigation.tsx', content);
