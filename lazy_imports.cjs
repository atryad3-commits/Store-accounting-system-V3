const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";') && !content.includes(' Suspense')) {
   content = content.replace(
    `import React, { useState, useEffect, useRef, useMemo } from 'react';`,
    `import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';`
   );
}

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

// Wrap the main content with Suspense
// Find <main className="flex-1 overflow-y-auto...
// and put <Suspense fallback={<BeautifulLoading />}> right inside its inner div
const mainDivStart = `                  <div\n                    className={\`mx-auto transition-all duration-300 print:max-w-none print:w-full print:px-0 \${isFullWidth ? "max-w-full xl:px-14" : "max-w-6xl"}\`}\n                  >`;

if (content.includes(mainDivStart)) {
    content = content.replace(mainDivStart, mainDivStart + `\n                    <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>`);
    
    // Find the end of this div, which is right before </main>
    const mainEnd = `                  </div>\n                </main>`;
    content = content.replace(mainEnd, `                    </Suspense>\n                  </div>\n                </main>`);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Lazy imports applied.");
