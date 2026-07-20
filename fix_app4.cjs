const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace('      } = appState;\n      return (\n        <>', '      } = appState;\n      if (isFastStocktaking) return <FastStocktakingMobile />;\n      return (\n        <>');
fs.writeFileSync('src/App.tsx', code);
