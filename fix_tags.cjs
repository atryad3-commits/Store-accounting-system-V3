const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const toReplace = `</main>\n<PricingWizardModal`;
const replaceWith = `</main>\n</div>\n</div>\n)}\n<PricingWizardModal`;

if (appTsx.includes(toReplace)) {
    appTsx = appTsx.replace(toReplace, replaceWith);
    fs.writeFileSync('src/App.tsx', appTsx);
    console.log("Fixed tags!");
} else {
    console.log("Not found.");
}
