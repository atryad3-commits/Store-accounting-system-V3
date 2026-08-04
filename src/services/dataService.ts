export * from './coreService';
export * from './settingsService';
export * from './userService';
export * from './personService';
export * from './accountingService';
export * from './inventoryService';
export * from './productService';
export * from './invoiceService';
export * from './crmService';
export * from './hrService';

export const getChecksSummary = async () => {
  const res = await fetch('/api/checks/summary', {
    headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''),
               'x-store-id': localStorage.getItem('activeStoreId') || 'default' }
  });
  if (!res.ok) throw new Error('Failed to fetch checks summary');
  return res.json();
};
