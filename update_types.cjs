const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(/export type Invoice = \{/g, 'export type Invoice = {\n  fiscalYearId?: string | number;');
content = content.replace(/export type Transaction = \{/g, 'export type Transaction = {\n  fiscalYearId?: string | number;');
content = content.replace(/export type Check = \{/g, 'export type Check = {\n  fiscalYearId?: string | number;');
content = content.replace(/export type Stocktaking = \{/g, 'export type Stocktaking = {\n  fiscalYearId?: string | number;');
fs.writeFileSync('src/types.ts', content);
