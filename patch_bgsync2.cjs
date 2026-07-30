const fs = require('fs');
let code = fs.readFileSync('src/components/common/BackgroundSync.tsx', 'utf8');

const regex = /const pendingTasks = queue\.filter\(t => t\.status === 'PENDING' \|\| t\.status === 'ERROR'\);\s*if \(pendingTasks\.length === 0\) return;\s*setIsSyncing\(true\);\s*for \(const task of pendingTasks\) {/g;

const newLogic = `
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

code = code.replace(regex, newLogic);
fs.writeFileSync('src/components/common/BackgroundSync.tsx', code);
console.log('patched BackgroundSync 2');
