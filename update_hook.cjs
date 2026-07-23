const fs = require('fs');

let hookStr = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

hookStr = hookStr.replace(`const [activeStoreId, setActiveStoreId] = useState<string | null>(localStorage.getItem("activeStoreId"));`, `// Removed activeStoreId state`);
hookStr = hookStr.replace(`const [availableStores, setAvailableStores] = useState<any[]>([]);`, `// Removed availableStores state`);
hookStr = hookStr.replace(`const [isStoreSelectionOpen, setIsStoreSelectionOpen] = useState(!localStorage.getItem("activeStoreId"));`, `// Removed isStoreSelectionOpen state`);

const importStatement = `import { useStore } from '../store';\n`;
if (!hookStr.includes(importStatement)) {
    hookStr = hookStr.replace(`import React,`, `${importStatement}import React,`);
}

const zustandHook = `  const { activeStoreId, setActiveStoreId, availableStores, setAvailableStores, isStoreSelectionOpen, setIsStoreSelectionOpen } = useStore();\n`;

hookStr = hookStr.replace(`const [activeFinancialYear, setActiveFinancialYearState] =`, `${zustandHook}  const [activeFinancialYear, setActiveFinancialYearState] =`);

// Also fix the localstorage usage
hookStr = hookStr.replace(/localStorage\.setItem\("activeStoreId", String\(id\)\);/g, `// LocalStorage handled by Zustand`);

fs.writeFileSync('src/hooks/useAppController.tsx', hookStr);
console.log("Hook updated");
