const fs = require('fs');
let code = fs.readFileSync('src/utils/format.ts', 'utf8');

code = code.replace(
`export function addCommas(num: number | string): string {
    if (!num && num !== 0 && num !== '0') return '';
    return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
}`,
`export function addCommas(num: number | string): string {
    if (!num && num !== 0 && num !== '0') return '';
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
    return parts.join('.');
}`
);

fs.writeFileSync('src/utils/format.ts', code);
console.log('patched addCommas');
