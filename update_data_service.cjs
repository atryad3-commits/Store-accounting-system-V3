const fs = require('fs');
let file = fs.readFileSync('src/services/dataService.ts', 'utf8');

file = file.replace(/getCheckHistory,/g, 'getCheckAuditLogs,');
file = file.replace(/addCheckHistory,/g, 'addCheckAuditLog,');

file = file.replace(/export {[\s\S]*?getCheckHistory,[\s\S]*?}/, (match) => {
  return match.replace(/getCheckHistory,/, 'getCheckAuditLogs,').replace(/addCheckHistory,/, 'addCheckAuditLog,');
});

fs.writeFileSync('src/services/dataService.ts', file);
