const db = require('better-sqlite3')('local_db.sqlite');
const res = db.prepare('SELECT value FROM store WHERE key = ?').get('payment_transactions');
console.log(res);
