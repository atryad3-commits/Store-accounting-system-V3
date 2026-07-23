const fs = require('fs');

let useApp = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

// 1. add imports
useApp = useApp.replace(
  /import React, \{ useState, useEffect, useMemo, useRef \} from "react";/,
  `import React, { useState, useEffect, useMemo, useRef } from "react";\nimport { useLocation, useNavigate } from "react-router-dom";`
);

// 2. replace activeTab state with react-router location
// find: const [activeTab, setRawActiveTab] = useState< ... >("welcome_page");
const activeTabRegex = /const \[activeTab, setRawActiveTab\] = useState<[\s\S]*?>\("welcome_page"\);/;
useApp = useApp.replace(activeTabRegex, `
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.substring(1) || "welcome_page";
  const setRawActiveTab = (tab: string) => navigate("/" + tab);
`);

// 3. remove hash routing effects
const hashEffectsRegex = /useEffect\(\(\) => \{\s*const handlePopState = \(\) => \{[\s\S]*?window\.removeEventListener\('popstate', handlePopState\);\s*\}\s*\}, \[\]\);\s*useEffect\(\(\) => \{\s*if \(activeTab && window\.location\.hash[\s\S]*?\}, \[activeTab\]\);/;
useApp = useApp.replace(hashEffectsRegex, `// Hash routing replaced by React Router`);

fs.writeFileSync('src/hooks/useAppController.tsx', useApp);
console.log("Replaced activeTab in useAppController");
