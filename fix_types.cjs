const fs = require('fs');
let typesStr = fs.readFileSync('src/types.ts', 'utf8');

const personTypeMatch = `export type Person = {`;
const personTypeReplacement = `export type PersonCategory = {
  id: string;
  name: string;
  color?: string;
  icon?: string;
};

export type Person = {`;
typesStr = typesStr.replace(personTypeMatch, personTypeReplacement);

const personPropsMatch = `role: 'customer' | 'employee' | 'supplier';`;
const personPropsReplacement = `role: 'customer' | 'employee' | 'supplier';
  roles?: string[];
  categories?: string[];
  taxNumber?: string;
  registrationNumber?: string;`;
typesStr = typesStr.replace(personPropsMatch, personPropsReplacement);

fs.writeFileSync('src/types.ts', typesStr);
