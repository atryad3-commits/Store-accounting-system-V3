import fs from 'fs';
let code = fs.readFileSync('src/components/modals/PersonIOModal.tsx', 'utf8');
code = code.replace(
  /\`persons_data_export_\$\{new Date\(\)\.toLocaleDateString\(storeSettings\?\.calendarType === "gregorian" \? "en-US" : "fa-IR"\)\.replace\(\/\\\\\/\\\/g, "-"\)\}\.json\`/g,
  '\`persons_data_export_\${Date.now()}.json\`'
);
code = code.replace(
  /\`persons_list_export_\$\{new Date\(\)\.toLocaleDateString\(storeSettings\?\.calendarType === "gregorian" \? "en-US" : "fa-IR"\)\.replace\(\/\\\\\/\\\/g, "-"\)\}\.csv\`/g,
  '\`persons_list_export_\${Date.now()}.csv\`'
);
fs.writeFileSync('src/components/modals/PersonIOModal.tsx', code);
