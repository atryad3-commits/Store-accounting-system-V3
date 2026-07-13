const fs = require('fs');

let content = fs.readFileSync('src/components/reports/DebtsCreditsReport.tsx', 'utf-8');

// Add getAccountingDocuments to imports
content = content.replace(
  'getReceivedChecks, getStoreSettings, getPersonGroups } from',
  'getReceivedChecks, getStoreSettings, getPersonGroups, getAccountingDocuments } from'
);

// Add state
content = content.replace(
  'const [receivedChecks, setReceivedChecks] = useState<any[]>([]);',
  'const [receivedChecks, setReceivedChecks] = useState<any[]>([]);\n  const [accountingDocuments, setAccountingDocuments] = useState<any[]>([]);'
);

// Add to fetchData
content = content.replace(
  'const rcData = await getReceivedChecks();',
  'const rcData = await getReceivedChecks();\n      const adData = await getAccountingDocuments();'
);

content = content.replace(
  'setReceivedChecks(rcData);',
  'setReceivedChecks(rcData);\n      setAccountingDocuments(adData);'
);

// Replace calculation
content = content.replace(
  /const calculatePersonBalance = \(personId: string \| number\) => \{[\s\S]*?return \{ amount: 0, status: 'بی‌حساب', value: 0, color: 'text-gray-500', bg: 'bg-gray-100' \};\n  \};/,
  `const calculatePersonBalance = (personId: string | number) => {
    const person = persons.find(p => p.id.toString() === personId.toString());
    if (!person) return { amount: 0, status: 'بی‌حساب', value: 0 };

    let balance = 0;
    
    (accountingDocuments || []).forEach(doc => {
      if (doc.status === 'draft' || doc.isDeleted) return;
      if (doc.items && Array.isArray(doc.items)) {
        doc.items.forEach(item => {
          if (item.detailedAccountId?.toString() === personId.toString()) {
            balance += (Number(item.debit) || 0) - (Number(item.credit) || 0);
          }
        });
      }
    });

    if (balance > 0) return { amount: balance, status: 'بدهکار', value: balance, color: 'text-rose-600', bg: 'bg-rose-50' };
    if (balance < 0) return { amount: Math.abs(balance), status: 'بستانکار', value: balance, color: 'text-emerald-600', bg: 'bg-emerald-50' };
    return { amount: 0, status: 'بی‌حساب', value: 0, color: 'text-gray-500', bg: 'bg-gray-100' };
  };`
);

fs.writeFileSync('src/components/reports/DebtsCreditsReport.tsx', content);
