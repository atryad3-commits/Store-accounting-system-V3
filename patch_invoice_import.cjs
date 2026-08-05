const fs = require('fs');
let code = fs.readFileSync('src/services/invoiceService.ts', 'utf8');

code = code.replace(
  "import { getLedgerAccounts, addAccountingDocument, getAccountingDocuments, updateAccountingDocument } from './accountingService';",
  "import { getLedgerAccounts, addLedgerAccount, addAccountingDocument, getAccountingDocuments, updateAccountingDocument } from './accountingService';"
);

code = code.replace(/const \{ addLedgerAccount \} = require\('\.\/accountingService'\);\n/g, '');
fs.writeFileSync('src/services/invoiceService.ts', code);
