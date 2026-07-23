const fs = require('fs');
let mainContent = fs.readFileSync('src/main.tsx', 'utf8');

if (!mainContent.includes('BrowserRouter')) {
    mainContent = mainContent.replace(
        `import { AuthProvider } from './context/AuthContext';`,
        `import { AuthProvider } from './context/AuthContext';\nimport { BrowserRouter } from 'react-router-dom';`
    );
    mainContent = mainContent.replace(
        `<AuthProvider>`,
        `<BrowserRouter>\n        <AuthProvider>`
    );
    mainContent = mainContent.replace(
        `</AuthProvider>`,
        `</AuthProvider>\n        </BrowserRouter>`
    );
    fs.writeFileSync('src/main.tsx', mainContent);
    console.log("Updated main.tsx");
}

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
if (!appContent.includes('useLocation')) {
    appContent = appContent.replace(
        `import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';`,
        `import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';\nimport { useLocation, useNavigate } from 'react-router-dom';`
    );
    
    const hookInsertion = `  const appState = useAppController();\n  const location = useLocation();\n  const navigate = useNavigate();\n\n  useEffect(() => {\n    const path = location.pathname.substring(1);\n    if (path && path !== appState.activeTab) {\n      appState.setActiveTab(path);\n    }\n  }, [location.pathname]);\n\n  useEffect(() => {\n    if (appState.activeTab && location.pathname !== \`/\${appState.activeTab}\`) {\n      navigate(\`/\${appState.activeTab}\`, { replace: true });\n    }\n  }, [appState.activeTab]);`;
    
    appContent = appContent.replace(
        `  const appState = useAppController();`,
        hookInsertion
    );
    fs.writeFileSync('src/App.tsx', appContent);
    console.log("Updated App.tsx with router hooks");
}
