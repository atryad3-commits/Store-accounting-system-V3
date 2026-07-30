const fs = require('fs');
let code = fs.readFileSync('src/components/common/BackgroundSync.tsx', 'utf8');

const prodImports = `
import { 
  addProductToServer, updateProductToServer, deleteProductToServer,
  addProductCategoryToServer, updateProductCategoryToServer, deleteProductCategoryToServer
} from '../../services/productService';
`;

code = code.replace("import { \n  addPersonToServer,", prodImports + "import { \n  addPersonToServer,");

const prodLogic = `        } else if (task.operation === 'ADD_PRODUCT') {
          const { isLocalUnsynced, ...payload } = task.payload;
          await addProductToServer(payload);
        } else if (task.operation === 'UPDATE_PRODUCT') {
          await updateProductToServer(task.payload.id, task.payload.product);
        } else if (task.operation === 'DELETE_PRODUCT') {
          await deleteProductToServer(task.payload.id);
        } else if (task.operation === 'ADD_PRODUCT_CATEGORY') {
          const { isLocalUnsynced, ...payload } = task.payload;
          await addProductCategoryToServer(payload);
        } else if (task.operation === 'UPDATE_PRODUCT_CATEGORY') {
          await updateProductCategoryToServer(task.payload.id, task.payload.category);
        } else if (task.operation === 'DELETE_PRODUCT_CATEGORY') {
          await deleteProductCategoryToServer(task.payload.id);
        }`;

// Insert at the end of the else if chain
code = code.replace(/        } else if \(task\.operation === 'DELETE_PERSON_CATEGORY'\) {\n          await deletePersonCategoryToServer\(task\.payload\.id\);\n        }/g, `        } else if (task.operation === 'DELETE_PERSON_CATEGORY') {
          await deletePersonCategoryToServer(task.payload.id);
${prodLogic}`);

fs.writeFileSync('src/components/common/BackgroundSync.tsx', code);
console.log('BackgroundSync updated for products');
