const { Project } = require('ts-morph');
const fs = require('fs');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('src/services/dataService.ts');

const domains = {
  settingsService: ['getStoreSettings', 'saveStoreSettings', 'getFinancialYears', 'saveFinancialYears', 'getActiveFinancialYear', 'addFinancialYear', 'closeFinancialYear', 'checkFinancialYear'],
  userService: ['getUsers', 'addUser', 'updateUser', 'deleteUser'],
  personService: ['getPersonGroups', 'addPersonGroup', 'updatePersonGroup', 'deletePersonGroup', 'getPersonRoles', 'addPersonRole', 'updatePersonRole', 'deletePersonRole', 'getPersonContacts', 'savePersonContacts', 'getPersonBankAccounts', 'savePersonBankAccounts', 'getPersons', 'addPerson', 'updatePerson', 'deletePerson', 'getPersonFollowUps', 'addPersonFollowUp', 'updatePersonFollowUp', 'deletePersonFollowUp', 'getDebtorsTrackings', 'saveDebtorsTrackings'],
  accountingService: ['ensureLedgerAccount', 'getAccounts', 'addAccount', 'updateAccount', 'deleteAccount', 'getCashboxes', 'addCashbox', 'updateCashbox', 'deleteCashbox', 'getCheckbooks', 'addCheckbook', 'updateCheckbook', 'deleteCheckbook', 'getIssuedChecks', 'getCheckHistory', 'addCheckHistory', 'addIssuedCheck', 'updateIssuedCheck', 'deleteIssuedCheck', 'getReceivedChecks', 'addReceivedCheck', 'updateReceivedCheck', 'deleteReceivedCheck', 'getRefundRequests', 'addRefundRequest', 'updateRefundRequest', 'deleteRefundRequest', 'getLoans', 'saveLoans', 'getLedgerAccounts', 'saveLedgerAccounts', 'addLedgerAccount', 'updateLedgerAccount', 'deleteLedgerAccount', 'getAccountingDocuments', 'saveAccountingDocuments', 'addAccountingDocument', 'updateAccountingDocument', 'deleteAccountingDocument', 'syncCheckAccountingDocument', 'getPersonOpeningBalances', 'addPersonOpeningBalance', 'updatePersonOpeningBalance', 'deletePersonOpeningBalance', 'getInstallments', 'saveInstallments'],
  inventoryService: ['getWarehouses', 'addWarehouse', 'updateWarehouse', 'deleteWarehouse', 'getWarehouseStocks', 'saveWarehouseStocks', 'recalculateAllWarehouseStocks', 'getStocktakings', 'saveStocktakings', 'addStocktaking', 'updateStocktaking', 'deleteStocktaking', 'getInventoryTransactions', 'getProductInventoryHistory'],
  productService: ['getProductCategories', 'addProductCategory', 'updateProductCategory', 'deleteProductCategory', 'getProducts', 'addProduct', 'updateProduct', 'deleteProduct', 'syncProductLatestPrices', 'getProductPriceHistory', 'updateProductPriceHistory'],
  invoiceService: ['syncInvoiceAllocations', 'getSalesInvoicePayments', 'getPurchaseInvoicePayments', 'getTransactions', 'addTransaction', 'updateTransaction', 'deleteTransaction', 'getInvoices', 'addInvoice', 'updateInvoice', 'voidInvoice', 'deleteInvoice'],
  crmService: ['getCrmColumns', 'saveCrmColumns', 'getSmsMessages', 'addSmsMessage', 'deleteSmsMessage', 'getPersonalNotes', 'savePersonalNotes', 'appendPersonalNote', 'updatePersonalNote', 'deletePersonalNote'],
  hrService: ['getPayslips', 'addPayslip', 'updatePayslip', 'deletePayslip']
};

const baseImports = `
import { 
  getLocalData, 
  saveLocalData, 
  updateLocalData, 
  appendLocalData, 
  batchLocalData, 
  generateId, 
  parseToGregorianDate, 
  generateDocNumber, 
  updateDocCounter, 
  getDatabaseLogs, 
  addDatabaseLog, 
  getSystemLogs, 
  addSystemLog,
  ensureFiscalYearId
} from './coreService';
import { CompanySettings } from '../types';
import { convertToGregorian } from '../utils/format';
`;

let reexports = `export * from './coreService';\n`;

for (const [domain, funcs] of Object.entries(domains)) {
  let fileContent = baseImports + '\n\n';
  for (const funcName of funcs) {
    const varDecl = sourceFile.getVariableDeclaration(funcName);
    if (varDecl) {
        const statement = varDecl.getVariableStatement();
        if (statement) {
           fileContent += statement.getText() + '\n\n';
        }
    } else {
        const funcDecl = sourceFile.getFunction(funcName);
        if (funcDecl) {
             fileContent += funcDecl.getText() + '\n\n';
        }
    }
  }
  fs.writeFileSync(`src/services/${domain}.ts`, fileContent);
  reexports += `export * from './${domain}';\n`;
  console.log(`Created ${domain}.ts`);
}

// Now extract the core variables and base functions to coreService.ts
const coreElements = [
    'CompanySettings', // skip, it's type
    'cache',
    'CACHE_DURATION',
    'CACHEABLE_KEYS',
    'invalidateCache',
    'FINANCIAL_KEYS',
    'mapTransactionTypeToTable',
    'mapInvoiceTypeToTable',
    'getLocalData', 
    'saveLocalData', 
    'updateLocalData', 
    'appendLocalData', 
    'batchLocalData', 
    'generateId', 
    'parseToGregorianDate', 
    'generateDocNumber', 
    'updateDocCounter', 
    'getDatabaseLogs', 
    'addDatabaseLog', 
    'getSystemLogs', 
    'addSystemLog',
    'ensureFiscalYearId'
];

let coreContent = `import { convertToGregorian } from '../utils/format';
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CompanySettings } from '../types';

`;

for (const elName of coreElements) {
    if (elName === 'CompanySettings') continue;
    const varDecl = sourceFile.getVariableDeclaration(elName);
    if (varDecl) {
        const statement = varDecl.getVariableStatement();
        if (statement) {
            coreContent += statement.getText() + '\n\n';
            continue;
        }
    }
    const funcDecl = sourceFile.getFunction(elName);
    if (funcDecl) {
         coreContent += funcDecl.getText() + '\n\n';
         continue;
    }
    // Might be just a variable not in a statement?
}

fs.writeFileSync(`src/services/coreService.ts`, coreContent);
console.log('Created coreService.ts');

// finally write dataService.ts to be just re-exports
fs.writeFileSync(`src/services/dataService.ts`, reexports);
console.log('Updated dataService.ts to re-exports');

