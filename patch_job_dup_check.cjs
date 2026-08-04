const fs = require('fs');
let file = fs.readFileSync('src/jobs/checkNotificationsJob.ts', 'utf8');

file = file.replace(
  /const createNotification = async \(title: string, message: string\) => \{/,
  `const createNotification = async (title: string, message: string) => {
  try {
    // Basic duplication check: don't create if identical message exists from the last 24h
    const existing = await db.select().from(notifications).where(
      and(
        eq(notifications.message, message)
      )
    );
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentDupe = existing.find(n => n.createdAt && new Date(n.createdAt) > yesterday);
    
    if (recentDupe) {
      return; // Skip duplicate
    }
  } catch (err) {
    console.error('Error checking for duplicate notification:', err);
  }
`
);

fs.writeFileSync('src/jobs/checkNotificationsJob.ts', file);
