const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(
  /const \{ connectionString \} = req\.body;\s*const client = new Client\(\{ connectionString \}\);/g,
  `const { connectionString, engine } = req.body;
      if (engine === 'sqlite' || connectionString === 'sqlite') {
         return res.json({ success: true, message: 'اتصال SQLite (ذخیره سازی محلی) با موفقیت تأیید شد' });
      }
      const client = new Client({ connectionString });`
);

fs.writeFileSync('server.ts', serverTs);
console.log("Updated db test");
