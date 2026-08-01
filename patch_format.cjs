const fs = require('fs');
const file = 'src/utils/format.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('export function formatNumber')) {
  content += `\nexport function formatNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return addCommas(num);
}\n`;
}

fs.writeFileSync(file, content);
