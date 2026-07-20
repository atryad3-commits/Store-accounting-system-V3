const fs = require('fs');
const appText = fs.readFileSync('src/App.tsx', 'utf8');
const appViewText = fs.readFileSync('src/AppView.tsx', 'utf8');

const jsxStart = appViewText.indexOf('<div');
const jsxEnd = appViewText.lastIndexOf('</div>') + 6;
const jsx = appViewText.substring(jsxStart, jsxEnd);

const newAppText = appText.replace('<AppView {...useAppController()} />', jsx);
fs.writeFileSync('src/App.tsx', newAppText);
fs.unlinkSync('src/AppView.tsx');
