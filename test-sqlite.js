import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('database.sqlite');
const res = db.prepare('SELECT value FROM store WHERE key = ?').get('payment_transactions');
console.log(res);
