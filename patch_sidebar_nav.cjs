const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  '<SidebarNavigation\n            mode="sidebar"',
  '<SidebarNavigation\n            setIsReceiveModalOpen={setIsReceiveModalOpen}\n            setIsPayModalOpen={setIsPayModalOpen}\n            mode="sidebar"'
);

content = content.replace(
  '<SidebarNavigation\n                mode="horizontal"',
  '<SidebarNavigation\n                setIsReceiveModalOpen={setIsReceiveModalOpen}\n                setIsPayModalOpen={setIsPayModalOpen}\n                mode="horizontal"'
);

fs.writeFileSync('src/App.tsx', content);
