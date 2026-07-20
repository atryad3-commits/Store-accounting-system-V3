const fs = require('fs');

let hookCode = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const loadingStart = hookCode.indexOf('if (loading || authLoading) {');
const setupStart = hookCode.indexOf('if (requiresInitSetup && user) {');
const setupEnd = hookCode.indexOf('const renderTabContent = () => {');

// Extract them
const jsxBlocks = hookCode.substring(loadingStart, setupEnd);

// Remove them from hookCode
hookCode = hookCode.substring(0, loadingStart) + hookCode.substring(setupEnd);

// Make sure authLoading and requiresInitSetup are exported
if (!hookCode.includes('authLoading,')) {
    hookCode = hookCode.replace('  return {', '  return {\n    authLoading,\n    requiresInitSetup,');
}

fs.writeFileSync('src/hooks/useAppController.tsx', hookCode);
fs.writeFileSync('extracted_jsx.tsx', jsxBlocks);

