const fs = require('fs');

let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');
mainTsx = mainTsx.replace(
  /if \(\(import\.meta as any\)\.env\.VITE_SENTRY_DSN\) \{/g,
  `if ((import.meta as any).env.VITE_SENTRY_DSN && String((import.meta as any).env.VITE_SENTRY_DSN).startsWith('http')) {`
);
fs.writeFileSync('src/main.tsx', mainTsx);

let serverTs = fs.readFileSync('server.ts', 'utf8');
serverTs = serverTs.replace(
  /if \(process\.env\.SENTRY_DSN\) \{/g,
  `if (process.env.SENTRY_DSN && String(process.env.SENTRY_DSN).startsWith('http')) {`
);
fs.writeFileSync('server.ts', serverTs);

console.log("Fixed Sentry init 2");
