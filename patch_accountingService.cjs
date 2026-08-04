const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(
  /export const updateIssuedCheck = async \(id: string, record: any\) => \{\s*let activeYear = null;\s*if \(record\.issueDate\) activeYear = await checkFinancialYear\(record\.issueDate\);\s*const updatedData = \{ \.\.\.record, updatedAt: Date\.now\(\) \};\s*try \{\s*const oldChecks = await getIssuedChecks\(\);\s*const previous = oldChecks\.find\(\(c: any\) => String\(c\.id\) === String\(id\)\);\s*const saved = await updateLocalData\('issued_checks', id, updatedData\);\s*await addCheckAuditLog\(\{ checkId: saved\.id, checkType: 'issued', action: 'update', oldValues: previous, newValues: saved, userId: 'system' \}\);\s*if \(typeof addSystemLog !== 'undefined'\) \{\s*await addSystemLog\('UPDATE_' \+ 'IssuedCheck'\.toUpperCase\(\), 'ویرایش رکورد در issued_checks', 'IssuedCheck', saved\.id\);\s*\}\s*if \(saved\) \{\s*await syncCheckAccountingDocument\('issued', saved, previous\);\s*\}\s*return saved;\s*\} catch \(e\) \{\s*return null;\s*\}\s*\};/,
  `export const updateIssuedCheck = async (id: string, record: any) => {
  let activeYear = null;
  if (record.issueDate) activeYear = await checkFinancialYear(record.issueDate);
  const updatedData = { ...record, updatedAt: Date.now() };
  try {
     const oldChecks = await getIssuedChecks();
     const previous = oldChecks.find((c: any) => String(c.id) === String(id));
     const saved = await updateLocalData('issued_checks', id, updatedData);
     await addCheckAuditLog({ checkId: saved.id, checkType: 'issued', action: 'update', oldValues: previous, newValues: saved, userId: 'system' });
     if (typeof addSystemLog !== 'undefined') {
       await addSystemLog('UPDATE_' + 'IssuedCheck'.toUpperCase(), 'ویرایش رکورد در issued_checks', 'IssuedCheck', saved.id);
     }
     if (saved) {
       await syncCheckAccountingDocument('issued', saved, previous);
     }
     return saved;
  } catch (e) {
     throw e;
  }
};`
);

file = file.replace(
  /export const updateReceivedCheck = async \(id: string, record: any\) => \{\s*let activeYear = null;\s*if \(record\.receiveDate\) activeYear = await checkFinancialYear\(record\.receiveDate\);\s*const updatedData = \{ \.\.\.record, updatedAt: Date\.now\(\) \};\s*try \{\s*const oldChecks = await getReceivedChecks\(\);\s*const previous = oldChecks\.find\(\(c: any\) => String\(c\.id\) === String\(id\)\);\s*const saved = await updateLocalData\('received_checks', id, updatedData\);\s*await addCheckAuditLog\(\{ checkId: saved\.id, checkType: 'received', action: 'update', oldValues: previous, newValues: saved, userId: 'system' \}\);\s*if \(typeof addSystemLog !== 'undefined'\) \{\s*await addSystemLog\('UPDATE_' \+ 'ReceivedCheck'\.toUpperCase\(\), 'ویرایش رکورد در received_checks', 'ReceivedCheck', saved\.id\);\s*\}\s*if \(saved\) \{\s*await syncCheckAccountingDocument\('received', saved, previous\);\s*\}\s*return saved;\s*\} catch \(e\) \{\s*return null;\s*\}\s*\};/,
  `export const updateReceivedCheck = async (id: string, record: any) => {
  let activeYear = null;
  if (record.receiveDate) activeYear = await checkFinancialYear(record.receiveDate);
  const updatedData = { ...record, updatedAt: Date.now() };
  try {
     const oldChecks = await getReceivedChecks();
     const previous = oldChecks.find((c: any) => String(c.id) === String(id));
     const saved = await updateLocalData('received_checks', id, updatedData);
     await addCheckAuditLog({ checkId: saved.id, checkType: 'received', action: 'update', oldValues: previous, newValues: saved, userId: 'system' });
     if (typeof addSystemLog !== 'undefined') {
       await addSystemLog('UPDATE_' + 'ReceivedCheck'.toUpperCase(), 'ویرایش رکورد در received_checks', 'ReceivedCheck', saved.id);
     }
     if (saved) {
       await syncCheckAccountingDocument('received', saved, previous);
     }
     return saved;
  } catch (e) {
     throw e;
  }
};`
);

fs.writeFileSync('src/services/accountingService.ts', file);
