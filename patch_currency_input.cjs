const fs = require('fs');
let code = fs.readFileSync('src/components/common/CurrencyInput.tsx', 'utf8');

const oldHandleChange = `  const handleChange = (e: any) => {
    let raw = persianToEnglish(e.target.value).replace(/,/g, "");
    if (raw && isNaN(Number(raw))) return;
    setLocalVal(addCommas(raw));
    if (onChange) onChange({ target: { value: raw } });
  };`;

const newHandleChange = `  const handleChange = (e: any) => {
    let raw = persianToEnglish(e.target.value).replace(/,/g, "");
    
    // Check storeSettings if provided
    if (props.storeSettings) {
      if (!props.storeSettings.use_decimals) {
         raw = raw.replace(/\\./g, '');
      } else {
         const places = props.storeSettings.decimal_places || 2;
         const parts = raw.split('.');
         if (parts.length > 1 && parts[1].length > places) {
             return;
         }
      }
    }

    if (raw && isNaN(Number(raw)) && raw !== '-' && raw !== '.' && raw !== '-.') return;
    setLocalVal(addCommas(raw));
    if (onChange) onChange({ target: { value: raw } });
  };`;

code = code.replace(oldHandleChange, newHandleChange);
fs.writeFileSync('src/components/common/CurrencyInput.tsx', code);
console.log('patched CurrencyInput');
