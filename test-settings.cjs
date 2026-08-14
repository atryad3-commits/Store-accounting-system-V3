const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('database_test.sqlite');
db.prepare('CREATE TABLE IF NOT EXISTS system_settings (setting_key TEXT PRIMARY KEY, setting_value TEXT)').run();
const stmt = db.prepare('INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value');
stmt.run('isSetup', 'true');
const rows = db.prepare("SELECT * FROM system_settings").all();
console.log(rows);
