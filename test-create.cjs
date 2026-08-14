const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(':memory:');
db.prepare('CREATE TABLE IF NOT EXISTS test (id TEXT PRIMARY KEY)').run();
console.log("Success");
