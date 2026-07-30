const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
const search = `export type PersonGroup = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  salePrice?: number;
  discountPercent?: number;
  minStockLevel?: number;
  color?: string; // e.g., 'indigo', 'emerald', 'amber', 'rose'
};`;
const replace = `export type PersonGroup = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};`;
code = code.replace(search, replace);
fs.writeFileSync('src/types.ts', code);
