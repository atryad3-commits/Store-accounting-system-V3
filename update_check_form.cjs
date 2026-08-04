const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/useCheckForm.ts', 'utf8');

file = file.replace(/addCheckHistory/g, 'addCheckAuditLog');
file = file.replace(/await addCheckAuditLog\({ checkId: existing\.id, checkType: 'issued', status: statusVal, date: new Date\(\)\.toISOString\(\), desc: statusDesc, user: currentUser }\);/g, "await addCheckAuditLog({ checkId: existing.id, checkType: 'issued', action: 'status_change', oldValues: { status: existing.status }, newValues: { status: statusVal }, userId: currentUser });");
file = file.replace(/await addCheckAuditLog\({ checkId: existing\.id, checkType: 'received', status: statusVal, date: new Date\(\)\.toISOString\(\), desc: statusDesc, user: currentUser }\);/g, "await addCheckAuditLog({ checkId: existing.id, checkType: 'received', action: 'status_change', oldValues: { status: existing.status }, newValues: { status: statusVal }, userId: currentUser });");

fs.writeFileSync('src/components/financial/checks/useCheckForm.ts', file);
