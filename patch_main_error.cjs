const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');
content = content.replace(
  'console.log("REACT KEY ERROR CAUGHT:", args[1] || args);',
  `fetch("/api/data/system_logs/append", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ action: "FRONTEND_ERROR", entityType: "error", entityId: "1", oldData: "REACT_KEY_ERROR", newData: JSON.stringify(args) }) });`
);
fs.writeFileSync('src/main.tsx', content);
