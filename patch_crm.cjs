const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
if (appCode.includes('<CRMDashboard showNotification={showNotification} persons={persons} />')) {
    appCode = appCode.replace('<CRMDashboard showNotification={showNotification} persons={persons} />', '<CRMDashboard showNotification={showNotification} persons={persons} storeSettings={storeSettings} />');
    fs.writeFileSync('src/App.tsx', appCode, 'utf-8');
}

// Patch CRMDashboard.tsx
let crmCode = fs.readFileSync('src/components/crm/CRMDashboard.tsx', 'utf-8');
if (crmCode.includes('showNotification, persons }: CRMDashboardProps')) {
    crmCode = crmCode.replace('showNotification, persons }: CRMDashboardProps', 'showNotification, persons, storeSettings }: any');
    crmCode = crmCode.replace('<DebtorsTracking persons={persons} showNotification={showNotification} />', '<DebtorsTracking persons={persons} showNotification={showNotification} storeSettings={storeSettings} />');
    fs.writeFileSync('src/components/crm/CRMDashboard.tsx', crmCode, 'utf-8');
}

console.log('Patched CRM components');
