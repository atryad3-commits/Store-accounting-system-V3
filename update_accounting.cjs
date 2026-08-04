const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(
  /export const getCheckHistory[\s\S]*?};\n/,
  "export const getCheckAuditLogs = async (checkId?: string | number, checkType?: 'issued' | 'received') => {\n  const data = await getLocalData<any[]>('check_audit_logs', []);\n  let filtered = data;\n  if (checkId) filtered = filtered.filter(h => String(h.checkId) === String(checkId));\n  if (checkType) filtered = filtered.filter(h => h.checkType === checkType);\n  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());\n};\n"
);

file = file.replace(
  /export const addCheckHistory = async \(record: { checkId: string \| number, checkType: 'issued' \| 'received', status: string, date: string, desc\?: string, user\?: string }\) => {[\s\S]*?};\n/,
  "export const addCheckAuditLog = async (record: { checkId: string | number, checkType: 'issued' | 'received', action: string, oldValues?: any, newValues?: any, userId?: string }) => {\n  const now = new Date().toISOString();\n  const newItem = { ...record, id: (Math.random() + 1).toString(36).substring(7), createdAt: now };\n  await appendLocalData('check_audit_logs', newItem);\n  return newItem;\n};\n"
);

// We need to also update references inside `addIssuedCheck`, `updateIssuedCheck`, `addReceivedCheck`, `updateReceivedCheck`.
file = file.replace(
  "await addCheckHistory({ checkId: newItem.id, checkType: 'issued', status: newItem.status || 'issued', date: new Date().toISOString(), desc: 'ثبت اولیه چک صادره' });",
  "await addCheckAuditLog({ checkId: newItem.id, checkType: 'issued', action: 'create', newValues: newItem, userId: 'system' });"
);

// We need to fix updateIssuedCheck to track old and new
file = file.replace(
  "const saved = await updateLocalData('issued_checks', id, updatedData);",
  "const saved = await updateLocalData('issued_checks', id, updatedData);\n     await addCheckAuditLog({ checkId: saved.id, checkType: 'issued', action: 'update', oldValues: previous, newValues: saved, userId: 'system' });"
);

// addReceivedCheck
file = file.replace(
  "await addCheckHistory({ checkId: newItem.id, checkType: 'received', status: newItem.status || 'received', date: new Date().toISOString(), desc: 'ثبت اولیه چک دریافتی' });",
  "await addCheckAuditLog({ checkId: newItem.id, checkType: 'received', action: 'create', newValues: newItem, userId: 'system' });"
);

// updateReceivedCheck
file = file.replace(
  "const saved = await updateLocalData('received_checks', id, updatedData);",
  "const saved = await updateLocalData('received_checks', id, updatedData);\n     await addCheckAuditLog({ checkId: saved.id, checkType: 'received', action: 'update', oldValues: previous, newValues: saved, userId: 'system' });"
);

fs.writeFileSync('src/services/accountingService.ts', file);
