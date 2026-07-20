const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const filter = `
const customPersonFilter = (option: any, inputValue: string) => {
  if (!inputValue) return true;
  const terms = inputValue.toLowerCase().split(" ").filter(Boolean);
  const searchable = (
    option.data.searchStr ||
    option.label ||
    ""
  ).toLowerCase();
  return terms.every((term) => searchable.includes(term));
};
`;
code = code.replace('export default function App() {', filter + 'export default function App() {');
fs.writeFileSync('src/App.tsx', code);
