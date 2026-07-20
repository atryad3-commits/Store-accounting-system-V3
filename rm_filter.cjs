const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');
const filterStart = code.indexOf('const customPersonFilter');
if (filterStart !== -1) {
    const filterEnd = code.indexOf('};', filterStart) + 2;
    code = code.substring(0, filterStart) + code.substring(filterEnd);
    fs.writeFileSync('src/hooks/useAppController.tsx', code);
}
