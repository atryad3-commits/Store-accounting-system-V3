fetch('http://localhost:3000/api/data/payment_transactions').then(r => r.json()).then(txs => console.log(txs.slice(-1)));
