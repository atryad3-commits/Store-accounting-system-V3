const fs = require('fs');
let code = fs.readFileSync('src/services/syncQueueService.ts', 'utf8');

code += `
import { useState, useEffect } from 'react';
export const useSyncQueueLength = () => {
  const [count, setCount] = useState(() => getSyncQueue().length);
  useEffect(() => {
    const handler = () => setCount(getSyncQueue().length);
    window.addEventListener('sync_queue_changed', handler);
    return () => window.removeEventListener('sync_queue_changed', handler);
  }, []);
  return count;
};
`;
fs.writeFileSync('src/services/syncQueueService.ts', code);
console.log('patched hook');
