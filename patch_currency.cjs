const fs = require('fs');
let content = fs.readFileSync('src/components/ui/CurrencyInput.tsx', 'utf8');
content = content.replace('onChange(clean);', 'onChange({ target: { value: clean } });');
fs.writeFileSync('src/components/ui/CurrencyInput.tsx', content);
