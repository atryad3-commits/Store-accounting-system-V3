const fs = require('fs');
let code = fs.readFileSync('src/services/accountingService.ts', 'utf8');

const target1 = `      { id: generateId(), code: '16', title: 'سایر دارایی‌ها', type: 'general', nature: 'debit', parentId: assetsId },`;
const new1 = `      { id: generateId(), code: '16', title: 'سایر دارایی‌ها', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '1601', title: 'وام‌های پرداختی', type: 'subsidiary', nature: 'debit', parentId: null },`; // wait, parentId needs to be the id of 16

const fullBlock = `      { id: generateId(), code: '11', title: 'موجودی نقد و بانک', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '12', title: 'حساب‌ها و اسناد دریافتنی تجاری', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '13', title: 'موجودی مواد و کالا', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '14', title: 'پیش پرداخت‌ها', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '15', title: 'دارایی‌های ثابت', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '16', title: 'سایر دارایی‌ها', type: 'general', nature: 'debit', parentId: assetsId },
      
      { id: generateId(), code: '21', title: 'حساب‌ها و اسناد پرداختنی تجاری', type: 'general', nature: 'credit', parentId: liabilitiesId },
      { id: generateId(), code: '22', title: 'سایر حساب‌ها و اسناد پرداختنی', type: 'general', nature: 'credit', parentId: liabilitiesId },`;

const newFullBlock = `      { id: generateId(), code: '11', title: 'موجودی نقد و بانک', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '12', title: 'حساب‌ها و اسناد دریافتنی تجاری', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '13', title: 'موجودی مواد و کالا', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '14', title: 'پیش پرداخت‌ها', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '15', title: 'دارایی‌های ثابت', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '16', title: 'سایر دارایی‌ها', type: 'general', nature: 'debit', parentId: assetsId },
      
      { id: generateId(), code: '21', title: 'حساب‌ها و اسناد پرداختنی تجاری', type: 'general', nature: 'credit', parentId: liabilitiesId },
      { id: generateId(), code: '22', title: 'سایر حساب‌ها و اسناد پرداختنی', type: 'general', nature: 'credit', parentId: liabilitiesId },`;

// Wait, I can just use getAccountForCode like in syncCheckAccountingDocument instead of changing getLedgerAccounts.
