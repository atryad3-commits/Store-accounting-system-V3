import fs from 'fs';
let code = fs.readFileSync('src/components/accounting/AccountingVerification.tsx', 'utf8');
code = code.replace(
  /const totalDebit = doc\.items\.reduce/g,
  'const totalDebit = (doc.items || []).reduce'
);
code = code.replace(
  /const totalCredit = doc\.items\.reduce/g,
  'const totalCredit = (doc.items || []).reduce'
);
code = code.replace(
  /const hasMissingLedger = doc\.items\.some/g,
  'const hasMissingLedger = (doc.items || []).some'
);
code = code.replace(
  /const hasZeroItem = doc\.items\.some/g,
  'const hasZeroItem = (doc.items || []).some'
);
code = code.replace(
  /else if \(doc\.items\.length < 2\)/g,
  'else if (!(doc.items) || doc.items.length < 2)'
);
fs.writeFileSync('src/components/accounting/AccountingVerification.tsx', code);
