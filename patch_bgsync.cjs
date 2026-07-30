const fs = require('fs');
let code = fs.readFileSync('src/components/common/BackgroundSync.tsx', 'utf8');

const oldLogic = `    const queue = getSyncQueue();
    const pendingTasks = queue.filter(t => t.status === 'PENDING' || t.status === 'ERROR');

    if (pendingTasks.length === 0) return;
    setIsSyncing(true);

    for (const task of pendingTasks) {`;

const newLogic = `    const queue = getSyncQueue();
    const tasksToProcess = [];
    for (const task of queue) {
      if (task.status === 'ERROR') {
        break; // Stop auto-processing if there is an error
      }
      if (task.status === 'PENDING') {
        tasksToProcess.push(task);
      }
    }

    if (tasksToProcess.length === 0) return;
    setIsSyncing(true);

    for (const task of tasksToProcess) {`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/common/BackgroundSync.tsx', code);
console.log('patched BackgroundSync');
