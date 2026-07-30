const fs = require('fs');
let code = fs.readFileSync('src/services/syncQueueService.ts', 'utf8');

code = code.replace(
`export const removeSyncTask = (taskId: string) => {
  const queue = getSyncQueue();
  const filtered = queue.filter(t => t.id !== taskId);
  saveSyncQueue(filtered);
};`,
`export const removeSyncTask = (taskId: string) => {
  const queue = getSyncQueue();
  const filtered = queue.filter(t => t.id !== taskId);
  saveSyncQueue(filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('trigger_background_sync'));
  }
};`
);

fs.writeFileSync('src/services/syncQueueService.ts', code);
console.log('patched syncQueueService');
