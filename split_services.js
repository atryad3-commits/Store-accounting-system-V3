const fs = require('fs');

const content = fs.readFileSync('src/services/dataService.ts', 'utf8');

const baseFuncs = ['getLocalData', 'saveLocalData', 'updateLocalData', 'appendLocalData', 'batchLocalData', 'generateId', 'parseToGregorianDate', 'generateDocNumber', 'updateDocCounter', 'getDatabaseLogs', 'addDatabaseLog', 'getSystemLogs', 'addSystemLog', 'ensureFiscalYearId'];

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

console.log("Domains ready to be split");
