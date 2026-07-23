const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add Suspense
content = content.replace(
    `import React, { useState, useEffect, useMemo, useRef } from "react";`,
    `import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";\nimport { useLocation, useNavigate, Routes, Route } from 'react-router-dom';`
);

const hookInsertion = `  const appState = useAppController();\n  const location = useLocation();\n  const navigate = useNavigate();\n\n  useEffect(() => {\n    const path = location.pathname.substring(1);\n    if (path && path !== appState.activeTab) {\n      appState.setActiveTab(path);\n    }\n  }, [location.pathname]);\n\n  useEffect(() => {\n    if (appState.activeTab && location.pathname !== \`/\${appState.activeTab}\`) {\n      navigate(\`/\${appState.activeTab}\`, { replace: true });\n    }\n  }, [appState.activeTab]);`;

content = content.replace(
    `  const appState = useAppController();`,
    hookInsertion
);

fs.writeFileSync('src/App.tsx', content);
console.log("Fixed App.tsx hooks");
