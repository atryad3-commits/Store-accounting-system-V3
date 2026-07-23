const fs = require('fs');

// 1. coreService.ts
let coreService = fs.readFileSync('src/services/coreService.ts', 'utf8');
coreService = coreService.replace(
  "import { getTransactions, getIssuedChecks, getReceivedChecks, getAccountingDocuments, getLoans, getInstallments } from './accountingService';",
  "import { getIssuedChecks, getReceivedChecks, getAccountingDocuments, getLoans, getInstallments } from './accountingService';\nimport { getTransactions } from './invoiceService';\nimport { getActiveFinancialYear } from './settingsService';"
);
fs.writeFileSync('src/services/coreService.ts', coreService);

// 2. personService.ts
let personService = fs.readFileSync('src/services/personService.ts', 'utf8');
personService = personService.replace(
  "import { ensureLedgerAccount, getTransactions, getIssuedChecks, getReceivedChecks } from './accountingService';",
  "import { ensureLedgerAccount, getIssuedChecks, getReceivedChecks } from './accountingService';\nimport { getTransactions } from './invoiceService';"
);
fs.writeFileSync('src/services/personService.ts', personService);

// 3. main.tsx
let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');
mainTsx = mainTsx.replace(/import\.meta\.env/g, '(import.meta as any).env');
fs.writeFileSync('src/main.tsx', mainTsx);

// 4. ProductFormModal.tsx
let productModal = fs.readFileSync('src/components/modals/ProductFormModal.tsx', 'utf8');
productModal = productModal.replace('validation.error.errors[0].message', '(validation.error as any).errors[0].message');
fs.writeFileSync('src/components/modals/ProductFormModal.tsx', productModal);

// 5. PersonFormModal.tsx
let personModal = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');
personModal = personModal.replace('validation.error.errors[0].message', '(validation.error as any).errors[0].message');
fs.writeFileSync('src/components/modals/PersonFormModal.tsx', personModal);

console.log("Fixed TS errors");
