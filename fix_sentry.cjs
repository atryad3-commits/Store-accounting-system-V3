const fs = require('fs');

let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');
mainTsx = mainTsx.replace(
  /if \(\(import\.meta as any\)\.env\.VITE_SENTRY_DSN\) \{\s*Sentry\.init\(\{[\s\S]*?\}\);\s*\}/,
  `if ((import.meta as any).env.VITE_SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: (import.meta as any).env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry:", e);
  }
}`
);
fs.writeFileSync('src/main.tsx', mainTsx);

let serverTs = fs.readFileSync('server.ts', 'utf8');
serverTs = serverTs.replace(
  /if \(process\.env\.SENTRY_DSN\) \{\s*Sentry\.init\(\{[\s\S]*?\}\);\s*\}/,
  `if (process.env.SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry on backend:", e);
  }
}`
);
fs.writeFileSync('server.ts', serverTs);

console.log("Fixed Sentry init");
