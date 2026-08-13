fetch('http://localhost:3000/api/data/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
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
  })
}).then(r => r.json()).then(console.log);
