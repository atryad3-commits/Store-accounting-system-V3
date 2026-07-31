const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const targetStr = `const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };`;

const replacementStr = `const formatCurrency = (amount: number) => {
    let maxDigits = 4;
    let minDigits = 0;
    if (storeSettings && storeSettings.use_decimals === false) {
      maxDigits = 0;
    } else if (storeSettings && storeSettings.use_decimals === true) {
      maxDigits = storeSettings.decimal_places || 2;
    }
    return new Intl.NumberFormat("fa-IR", { 
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: minDigits
    }).format(amount || 0);
  };`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/hooks/useAppController.tsx', code);
console.log('patched formatCurrency');
