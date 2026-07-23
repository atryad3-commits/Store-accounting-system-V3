const fs = require('fs');

const exportsMap = {
  'checkFinancialYear': './settingsService',
  'getActiveFinancialYear': './settingsService',
  'getStoreSettings': './settingsService',
  'getInvoices': './invoiceService',
  'getTransactions': './accountingService',
  'getIssuedChecks': './accountingService',
  'getReceivedChecks': './accountingService',
  'getPersons': './personService',
  'getProducts': './productService',
  'getAccountingDocuments': './accountingService',
  'getLoans': './accountingService',
  'getInstallments': './accountingService',
  'ensureFiscalYearId': './coreService',
  'mapTransactionTypeToTable': './coreService',
  'getLedgerAccounts': './accountingService',
  'addAccountingDocument': './accountingService',
  'updateAccountingDocument': './accountingService',
  'mapInvoiceTypeToTable': './coreService',
  'syncProductLatestPrices': './productService',
  'recalculateAllWarehouseStocks': './inventoryService',
  'ensureLedgerAccount': './accountingService',
};

const missing = [
  { file: 'src/services/accountingService.ts', vars: ['checkFinancialYear', 'getActiveFinancialYear', 'getStoreSettings'] },
  { file: 'src/services/coreService.ts', vars: ['getStoreSettings', 'getInvoices', 'getTransactions', 'getIssuedChecks', 'getReceivedChecks', 'getPersons', 'getProducts', 'getAccountingDocuments', 'getLoans', 'getInstallments'] },
  { file: 'src/services/crmService.ts', vars: [] },
  { file: 'src/services/hrService.ts', vars: ['checkFinancialYear', 'getActiveFinancialYear'] },
  { file: 'src/services/inventoryService.ts', vars: ['getInvoices', 'checkFinancialYear'] },
  { file: 'src/services/invoiceService.ts', vars: ['checkFinancialYear', 'mapTransactionTypeToTable', 'getLedgerAccounts', 'getStoreSettings', 'addAccountingDocument', 'getAccountingDocuments', 'updateAccountingDocument', 'mapInvoiceTypeToTable', 'syncProductLatestPrices', 'recalculateAllWarehouseStocks'] },
  { file: 'src/services/personService.ts', vars: ['getStoreSettings', 'ensureLedgerAccount', 'getInvoices', 'getTransactions', 'getIssuedChecks', 'getReceivedChecks'] },
  { file: 'src/services/productService.ts', vars: ['getStoreSettings'] },
];

for (const item of missing) {
  if (item.vars.length === 0) continue;
  let content = fs.readFileSync(item.file, 'utf8');
  
  // Group by module
  const importsByModule = {};
  for (const v of item.vars) {
    const mod = exportsMap[v];
    if (mod) {
      importsByModule[mod] = importsByModule[mod] || [];
      importsByModule[mod].push(v);
    }
  }
  
  let importStatements = '';
  for (const mod in importsByModule) {
    importStatements += `import { ${importsByModule[mod].join(', ')} } from '${mod}';\n`;
  }
  
  content = importStatements + content;
  fs.writeFileSync(item.file, content);
}
console.log("Imports added");
