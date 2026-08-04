const fs = require('fs');

const files = [
  'src/components/financial/checks/IssuedChecksList.tsx',
  'src/components/financial/checks/ReceivedChecksList.tsx',
  'src/components/financial/checks/useChecks.ts',
  'src/components/financial/CheckManagement.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/getCheckHistory/g, 'getCheckAuditLogs');
  fs.writeFileSync(file, content);
}

