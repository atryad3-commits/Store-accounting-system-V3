const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for AdminLTELayout
let newContent = content.replace(
  'export default function App() {',
  'import AdminLTELayout from "./layouts/AdminLTE/AdminLTELayout";\n\nexport default function App() {'
);

// 2. We need to extract the Routes into a variable.
// But wait, it's easier to just duplicate it or conditionally render the layout wrappers.
// Let's find the ModuleSelector block:
const moduleSelectorBlock = `          ) : (
            <div
              className={\`flex \${menuLayout === "horizontal" ? "flex-col h-screen" : "h-screen"} overflow-hidden \${isGmailTheme ? "theme-gmail bg-[#f6f8fc]" : \`theme-\${storeSettings?.theme || "classic"} bg-gray-50/50\`} text-gray-800 font-sans print:h-auto print:block print:overflow-visible main-app-layout-wrapper\`}
              dir="rtl"
            >`;

const replacement1 = `          ) : storeSettings?.theme === "persian_admin_lte" ? (
             <AdminLTELayout appState={appState}>
                <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
                    {/* We will let AdminLTELayout render its own routing if needed, but since we are extracting, we can just call renderTabContent() for now */}
                    {renderTabContent()}
                </Suspense>
             </AdminLTELayout>
          ) : (
            <div
              className={\`flex \${menuLayout === "horizontal" ? "flex-col h-screen" : "h-screen"} overflow-hidden \${isGmailTheme ? "theme-gmail bg-[#f6f8fc]" : \`theme-\${storeSettings?.theme || "classic"} bg-gray-50/50\`} text-gray-800 font-sans print:h-auto print:block print:overflow-visible main-app-layout-wrapper\`}
              dir="rtl"
            >`;

newContent = newContent.replace(moduleSelectorBlock, replacement1);

fs.writeFileSync('src/App.tsx', newContent);
console.log('App.tsx patched!');
