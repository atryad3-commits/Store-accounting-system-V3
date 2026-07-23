const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const importTarget = `import express from 'express';`;
const sentryImport = `import * as Sentry from "@sentry/node";\nimport { nodeProfilingIntegration } from "@sentry/profiling-node";\nimport express from 'express';`;

if (!content.includes('@sentry/node')) {
  content = content.replace(importTarget, sentryImport);
}

const sentryInitTarget = `async function startServer() {`;
const sentryInit = `if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}

async function startServer() {`;

if (!content.includes('Sentry.init')) {
  content = content.replace(sentryInitTarget, sentryInit);
}

const expressErrorHandlerTarget = `  if (process.env.NODE_ENV !== 'production') {`;
const expressErrorHandler = `  // Sentry error handler should be before any other error middleware and after all controllers
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  if (process.env.NODE_ENV !== 'production') {`;

if (!content.includes('Sentry.setupExpressErrorHandler')) {
  content = content.replace(expressErrorHandlerTarget, expressErrorHandler);
}

fs.writeFileSync('server.ts', content);
console.log('Patched server.ts with Sentry');
