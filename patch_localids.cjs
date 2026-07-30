const fs = require('fs');

function replaceLocalId(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(/const localId = 'local_' \+ Date\.now\(\) \+ '_' \+ Math\.random\(\)\.toString\(36\)\.substring\(2, 9\);/g, 'const localId = generateId();');
  fs.writeFileSync(filePath, code);
}

replaceLocalId('src/services/productService.ts');
replaceLocalId('src/services/personService.ts');
console.log('patched localIds');
