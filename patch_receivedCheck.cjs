const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(
  /export const updateReceivedCheck = async \(id: string, record: any\) => \{\s*const checkDate = record\.receiveDate \|\| record\.issueDate;\s*let activeYear = null;\s*if \(checkDate\) activeYear = await checkFinancialYear\(checkDate\);\s*const updatedData = \{ \.\.\.record, updatedAt: Date\.now\(\) \};\s*try \{\s*const oldChecks = await getReceivedChecks\(\);\s*const previous = oldChecks\.find\(\(c: any\) => String\(c\.id\) === String\(id\)\);\s*const saved = await updateLocalData\('received_checks', id, updatedData\);\s*await addCheckAuditLog\(\{ checkId: saved\.id, checkType: 'received', action: 'update', oldValues: previous, newValues: saved, userId: 'system' \}\);\s*if \(typeof addSystemLog !== 'undefined'\) \{\s*await addSystemLog\('UPDATE_' \+ 'ReceivedCheck'\.toUpperCase\(\), 'ویرایش رکورد در received_checks', 'ReceivedCheck', saved\.id\);\s*\}\s*if \(saved\) \{\s*await syncCheckAccountingDocument\('received', saved, previous\);\s*\}\s*return saved;\s*\} catch \(e\) \{\s*return null;\s*\}\s*\};/,
  `export const updateReceivedCheck = async (id: string, record: any) => {
  const checkDate = record.receiveDate || record.issueDate;
  let activeYear = null;
  if (checkDate) activeYear = await checkFinancialYear(checkDate);
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
