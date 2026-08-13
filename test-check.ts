import { addIssuedCheck } from './src/services/accountingService.js';
import { addTransaction } from './src/services/invoiceService.js';

async function test() {
  const payload = {
    type: 'pay',
    method: 'check',
    amount: 5000,
    date: new Date().toISOString(),
    personId: '123',
    checkNumber: '888999',
    checkbookId: '1',
    checkDueDate: '1403/12/29',
    description: 'Test check',
    skipAccounting: true
  };
  
  try {
     const tx = await addTransaction(payload);
     console.log('Transaction:', tx);
  } catch(e) {
     console.error(e);
  }
}
test();
