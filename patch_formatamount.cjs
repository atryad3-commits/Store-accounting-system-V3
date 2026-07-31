const fs = require('fs');
let code = fs.readFileSync('src/utils/format.ts', 'utf8');

const newFunc = `
export function formatAmount(num: number | string, storeSettings?: any): string {
    if (!num && num !== 0 && num !== '0') return '';
    let val = Number(num);
    if (isNaN(val)) return num.toString();
    
    if (storeSettings && storeSettings.use_decimals === false) {
        val = Math.round(val);
    } else if (storeSettings && storeSettings.use_decimals === true) {
        const places = storeSettings.decimal_places || 2;
        val = Number(val.toFixed(places));
    } else {
        // default: round to 2 places maximum if not specified
        val = Number(val.toFixed(4));
    }
    return addCommas(val.toString());
}
`;

code += newFunc;
fs.writeFileSync('src/utils/format.ts', code);
console.log('patched formatAmount');
