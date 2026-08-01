const fs = require('fs');
const file = 'src/types.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'export type Account = {',
  'export type Account = {\n  accountingCode?: string;'
);

content = content.replace(
  'export type Cashbox = {',
  'export type Cashbox = {\n  accountingCode?: string;'
);

fs.writeFileSync(file, content);
