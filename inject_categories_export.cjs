const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

// The exported variables are at the end:
// return {
//   ...
//   personRoles,
//   ...

const searchStr = 'personRoles,';
if (code.includes(searchStr)) {
  const lastIndex = code.lastIndexOf(searchStr);
  if (lastIndex > 0) {
    code = code.substring(0, lastIndex) + 'personRoles,\n    personCategories,' + code.substring(lastIndex + searchStr.length);
    fs.writeFileSync('src/hooks/useAppController.tsx', code);
    console.log('Injected personCategories into exports');
  }
}

