const fs = require('fs');
let content = fs.readFileSync('src/services/dataService.ts', 'utf8');

// For transaction
content = content.replace(/if \(transaction\.date\) await checkFinancialYear\(transaction\.date\);/g, 'let activeYear = null;\n  if (transaction.date) activeYear = await checkFinancialYear(transaction.date);');
content = content.replace(/const newTransaction = { ...transaction, id: generateId\(\), createdAt: now };/g, 'const newTransaction = { ...transaction, id: generateId(), createdAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };');

content = content.replace(/if \(updated\.date\) await checkFinancialYear\(updated\.date\);/g, 'let activeYear = null;\n  if (updated.date) activeYear = await checkFinancialYear(updated.date);');
// For transaction update (it uses updatedData)
content = content.replace(/const updatedData = { ...updated, updatedAt: Date.now\(\) };/g, 'const updatedData = { ...updated, updatedAt: Date.now() };\n  if (activeYear) updatedData.fiscalYearId = activeYear.id;');

// For invoices
content = content.replace(/if \(invoice\.date\) await checkFinancialYear\(invoice\.date\);/g, 'let activeYear = null;\n  if (invoice.date) activeYear = await checkFinancialYear(invoice.date);');
content = content.replace(/const newInvoice = { ...finalInvoiceObj, id: generateId\(\), createdAt: now, updatedAt: now };/g, 'const newInvoice = { ...finalInvoiceObj, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };');

// For checks
content = content.replace(/if \(record\.issueDate\) await checkFinancialYear\(record\.issueDate\);/g, 'let activeYear = null;\n  if (record.issueDate) activeYear = await checkFinancialYear(record.issueDate);');
content = content.replace(/const newItem = { ...record, id: generateId\(\), createdAt: now, updatedAt: now };/g, 'const newItem = { ...record, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };');

content = content.replace(/if \(checkDate\) await checkFinancialYear\(checkDate\);/g, 'let activeYear = null;\n  if (checkDate) activeYear = await checkFinancialYear(checkDate);');

// For stocktakings
content = content.replace(/if \(st\.date\) await checkFinancialYear\(st\.date\);/g, 'let activeYear = null;\n  if (st.date) activeYear = await checkFinancialYear(st.date);');
content = content.replace(/const added = { ...st, id: generateId\(\) };/g, 'const added = { ...st, id: generateId(), fiscalYearId: activeYear ? activeYear.id : undefined };');

content = content.replace(/if \(updatedSt\.date\) await checkFinancialYear\(updatedSt\.date\);/g, 'let activeYear = null;\n  if (updatedSt.date) activeYear = await checkFinancialYear(updatedSt.date);');
content = content.replace(/stocktakings\[idx\] = updatedSt;/g, 'if (activeYear) updatedSt.fiscalYearId = activeYear.id;\n    stocktakings[idx] = updatedSt;');

fs.writeFileSync('src/services/dataService.ts', content);
