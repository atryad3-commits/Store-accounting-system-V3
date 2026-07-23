const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const routesEnd = '</Routes>';
const nextGoodComponent = '<PricingWizardModal';

const routesIndex = appTsx.indexOf(routesEnd);
const nextIndex = appTsx.indexOf(nextGoodComponent);

if (routesIndex !== -1 && nextIndex !== -1) {
    const newAppTsx = appTsx.substring(0, routesIndex + routesEnd.length) + 
      `\n                    </Suspense>\n                  </div>\n                </main>\n` + 
      appTsx.substring(nextIndex);
    fs.writeFileSync('src/App.tsx', newAppTsx);
    console.log("Fixed broken JSX in App.tsx");
}
