const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  /return rows\.map\(\(r: any\) => \(\{ key: r\.key, value: JSON\.parse\(r\.value\) \}\)\);/,
  `return rows.map((r: any) => {
      try {
        return { key: r.key, value: JSON.parse(r.value) };
      } catch (e) {
        return { key: r.key, value: r.value };
      }
    });`
);
fs.writeFileSync('server.ts', code);
