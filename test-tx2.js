fetch('http://localhost:3000/api/data/transactions').then(r => r.json()).then(txs => console.log(txs.slice(-1)));
