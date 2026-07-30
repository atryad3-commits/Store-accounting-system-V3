import React, { useEffect, useState, useCallback } from 'react';
import { getSyncQueue, updateSyncTaskStatus, removeSyncTask, SyncTask } from '../../services/syncQueueService';
import { addPersonToServer, updatePersonToServer, deletePersonToServer } from '../../services/personService';

export default function BackgroundSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const processQueue = useCallback(async () => {
    if (isSyncing) return;
    const queue = getSyncQueue();
    const pendingTasks = queue.filter(t => t.status === 'PENDING' || t.status === 'ERROR');
    if (pendingTasks.length === 0) return;

    setIsSyncing(true);

    for (const task of pendingTasks) {
      updateSyncTaskStatus(task.id, 'SYNCING');
      try {
        if (task.operation === 'ADD_PERSON') {
          // Remove local flag before saving
          const { isLocalUnsynced, ...payload } = task.payload;
          await addPersonToServer(payload);
        } else if (task.operation === 'UPDATE_PERSON') {
          await updatePersonToServer(task.payload.id, task.payload.person);
        } else if (task.operation === 'DELETE_PERSON') {
          await deletePersonToServer(task.payload.id);
        }

        // Successfully synced!
        removeSyncTask(task.id);
      } catch (error: any) {
        console.error('Failed to sync task:', task, error);
        updateSyncTaskStatus(task.id, 'ERROR', error.message || 'Unknown error');
        // Stop syncing rest of queue to maintain order consistency
        break; 
      }
    }

    setIsSyncing(false);
  }, [isSyncing]);

  useEffect(() => {
    // Initial sync attempt
    processQueue();

    // Listen for manual triggers
    const handleTrigger = () => processQueue();
    window.addEventListener('trigger_background_sync', handleTrigger);
    
    // Poll every 10 seconds just in case
    const interval = setInterval(() => {
       processQueue();
    }, 10000);

    return () => {
      window.removeEventListener('trigger_background_sync', handleTrigger);
      clearInterval(interval);
    };
  }, [processQueue]);

  return null; // Silent background component
}
