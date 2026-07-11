import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('database.sqlite');
console.log(db.prepare("SELECT value FROM store WHERE key='persons'").get());
