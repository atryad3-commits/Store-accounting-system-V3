const fs = require('fs');
let code = fs.readFileSync('src/components/ui/CustomDatePicker.tsx', 'utf8');

code = code.replace(/const TodayButton = \(\{ setValue, range \}: any\) => \{/, "const TodayButton = (props: any) => {\n  const { setValue, setDate, range, date, handleChange } = props;\n  console.log('TodayButton props:', Object.keys(props));");

code = code.replace(/setValue\(/g, "(setValue || setDate || handleChange || (() => {}))(");

fs.writeFileSync('src/components/ui/CustomDatePicker.tsx', code);
