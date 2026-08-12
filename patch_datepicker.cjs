const fs = require('fs');
let code = fs.readFileSync('src/components/ui/CustomDatePicker.tsx', 'utf8');

code = code.replace(
    /if \(typeof props\.value === 'string' && props\.value\) \{[\s\S]*?\} else if \(Array\.isArray\(props\.value\)\) \{[\s\S]*?\}/m,
    `if (typeof props.value === 'string' && props.value) {
    if (props.value.includes('T') || props.value.startsWith('20') || props.value.startsWith('19')) {
      parsedValue = new Date(convertToGregorian(props.value));
    } else {
      // It's likely a Shamsi string, let DatePicker parse it directly using format
      parsedValue = props.value;
    }
  } else if (Array.isArray(props.value)) {
    parsedValue = props.value.map((v: any) => {
      if (typeof v === 'string') {
        if (v.includes('T') || v.startsWith('20') || v.startsWith('19')) {
          return new Date(convertToGregorian(v));
        }
        return v;
      }
      return v;
    });
  }`
);

fs.writeFileSync('src/components/ui/CustomDatePicker.tsx', code);
