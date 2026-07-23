const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const importTarget = `import {StrictMode, useState} from 'react';`;
const importReplacement = `import {StrictMode, useState, useEffect} from 'react';\nimport * as Sentry from "@sentry/react";`;

if (!content.includes('@sentry/react')) {
  content = content.replace(importTarget, importReplacement);
}

const sentryInit = `
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\\/\\/yourserver\\.io\\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
`;

if (!content.includes('Sentry.init')) {
  content = content.replace(`import {createRoot}from 'react-dom/client';`, `import {createRoot} from 'react-dom/client';\n${sentryInit}`);
}

const setupCompleteTarget = `        <QueryClientProvider client={queryClient}>`;
const setupCompleteReplacement = `        <QueryClientProvider client={queryClient}>`;

content = content.replace(setupCompleteTarget, setupCompleteReplacement);

fs.writeFileSync('src/main.tsx', content);
console.log('Patched main.tsx with Sentry');
