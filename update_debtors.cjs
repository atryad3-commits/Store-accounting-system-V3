const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const importStatementOld = "import { getDebtorsTrackings, saveDebtorsTrackings } from '../../services/dataService';";
const importStatementNew = "import { getDebtorsTrackings, saveDebtorsTrackings, getCrmColumns, saveCrmColumns } from '../../services/dataService';";
code = code.replace(importStatementOld, importStatementNew);

// In the props, we should add confirmAction
const defaultExportOld = `export default function DebtorsTracking({ persons, showNotification, storeSettings }: any) {`;
const defaultExportNew = `export default function DebtorsTracking({ persons, showNotification, storeSettings, confirmAction }: any) {`;
code = code.replace(defaultExportOld, defaultExportNew);

// Remove const COLUMNS = [...]; from top
code = code.replace(/const COLUMNS = \[([\s\S]*?)\];/g, '');

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Update imports and props');
