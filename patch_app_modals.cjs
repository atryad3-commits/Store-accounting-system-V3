const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add state variables
content = content.replace(
  '// Receipts & Payments Form State',
  `// Receipts & Payments Form State\n  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);\n  const [isPayModalOpen, setIsPayModalOpen] = useState(false);`
);

fs.writeFileSync('src/App.tsx', content);
