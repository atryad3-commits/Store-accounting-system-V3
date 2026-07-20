const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
const extracted = fs.readFileSync('extracted_jsx.tsx', 'utf8');

const targetStr = '} = appState;';
const injectIndex = appCode.indexOf(targetStr);
if (injectIndex !== -1) {
    appCode = appCode.substring(0, injectIndex + targetStr.length) + '\n' + extracted + '\n' + appCode.substring(injectIndex + targetStr.length);
    fs.writeFileSync('src/App.tsx', appCode);
}
