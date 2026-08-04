const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

file = file.replace(
  /onCheckUpdated=\{\(\) => \{\n\s*\/\/ Trigger a refetch if possible\. Since we're using React Query, invalidating queries would be best\.\n\s*\/\/ For now, it will refetch automatically or we can trigger it\.\n\s*\}\}/,
  "onCheckUpdated={fetchData}"
);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
