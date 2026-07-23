const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target = `  if (process.env.NODE_ENV !== "production") {`;
const replacement = `  // Sentry error handler should be before any other error middleware and after all controllers
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  if (process.env.NODE_ENV !== "production") {`;

if (!content.includes('Sentry.setupExpressErrorHandler')) {
  content = content.replace(target, replacement);
  fs.writeFileSync('server.ts', content);
  console.log("Patched Sentry.setupExpressErrorHandler");
} else {
  console.log("Already patched");
}
