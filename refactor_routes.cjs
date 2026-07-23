const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
if (!content.includes('import { BrowserRouter, Routes, Route, useNavigate, useLocation }')) {
  content = content.replace(
    `import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';`,
    `import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';\nimport { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';`
  );
  if(!content.includes('import { BrowserRouter')) {
    content = `import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';\n` + content;
  }
}

// 2. Change static imports to React.lazy for components from './components/...'
const importRegex = /import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+["'](\.\/components\/[^"']+)["'];/g;
let match;
const lazyImports = [];
while ((match = importRegex.exec(content)) !== null) {
  const compName = match[1];
  const compPath = match[2];
  if (compName !== 'SidebarNavigation' && compName !== 'InitialSetupWizard') {
    lazyImports.push({ full: match[0], compName, compPath });
  }
}

lazyImports.forEach(imp => {
  content = content.replace(imp.full, `const ${imp.compName} = React.lazy(() => import('${imp.compPath}'));`);
});

if(!content.includes('import SidebarNavigation')) {
    content = content.replace(`const SidebarNavigation = React.lazy(() => import('./components/SidebarNavigation'));`, `import SidebarNavigation from './components/SidebarNavigation';`);
}

// 3. Transform ternary into Routes
// The block starts with {activeTab === "products" ? (
// and ends with ) : activeTab === "users_manager" ? ( ... ) : null}

let routesContent = content;

// Replace `{activeTab === "products" ? (` with `<Routes>\n<Route path="/products" element={`
routesContent = routesContent.replace(/\{activeTab === "([^"]+)" \? \(/, '<Suspense fallback={<div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}><Routes>\n<Route path="/$1" element={<>');

// Replace `) : activeTab === "xyz" ? (` with `</>} />\n<Route path="/xyz" element={<>`
routesContent = routesContent.replace(/\)\s*:\s*activeTab === "([^"]+)"\s*\?\s*\(/g, '</>} />\n<Route path="/$1" element={<>');

// Replace final `) : null}` or `) : ( ... )}` with closing tags.
// Wait, the end of the ternary is probably `) : null}` or `) : <Default />}`
// Let's just find `) : null}` and replace with `</>} />\n<Route path="*" element={<Navigate to="/welcome_page" replace />} />\n</Routes></Suspense>`
routesContent = routesContent.replace(/\)\s*:\s*null\s*\}/g, '</>} />\n<Route path="*" element={<Navigate to="/welcome_page" replace />} />\n</Routes></Suspense>');

fs.writeFileSync('src/App.tsx', routesContent);
console.log("Replaced ternaries and imports.");
