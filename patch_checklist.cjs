const fs = require('fs');
let code = fs.readFileSync('src/utils/sidebarData.tsx', 'utf-8');

const target = `{ id: "system_diagnostics", label: "عیب‌یابی سیستم", roles: ["admin"] },`;
const replacement = `{ id: "checklist", label: "چک‌لیست سیستم", roles: ["admin"] },\n      { id: "system_diagnostics", label: "عیب‌یابی سیستم", roles: ["admin"] },`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/utils/sidebarData.tsx', code, 'utf-8');
  console.log('Added checklist to sidebar');
} else {
  console.log('Could not find target string for checklist patch');
}
