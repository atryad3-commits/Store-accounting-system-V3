const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const target = `import {createRoot} from 'react-dom/client';`;
const sentryInit = `import {createRoot} from 'react-dom/client';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
`;

if (!content.includes('Sentry.init')) {
  content = content.replace(target, sentryInit);
}

fs.writeFileSync('src/main.tsx', content);
console.log('Patched main.tsx with Sentry.init');
