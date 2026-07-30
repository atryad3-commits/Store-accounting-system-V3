const fs = require('fs');
let code = fs.readFileSync('src/services/productService.ts', 'utf8');

// 1. Imports
const importsToAdd = "import { enqueueSyncTask, getSyncQueue } from './syncQueueService';\n";
code = code.replace(
  "import { convertToGregorian } from '../utils/format';",
  "import { convertToGregorian } from '../utils/format';\n" + importsToAdd
);

// 2. Rename functions to *ToServer
code = code.replace('export const addProduct = async (product: any) => {', 'export const addProductToServer = async (product: any) => {');
code = code.replace('export const updateProduct = async (id: string, product: any) => {', 'export const updateProductToServer = async (id: string, product: any) => {');
code = code.replace('export const deleteProduct = async (id: string) => {', 'export const deleteProductToServer = async (id: string) => {');

code = code.replace('export const addProductCategory = async (category: any) => {', 'export const addProductCategoryToServer = async (category: any) => {');
code = code.replace('export const updateProductCategory = async (id: string, category: any) => {', 'export const updateProductCategoryToServer = async (id: string, category: any) => {');
code = code.replace('export const deleteProductCategory = async (id: string) => {', 'export const deleteProductCategoryToServer = async (id: string) => {');

// 3. getProducts
const getProductsMatch = `export const getProducts = async () => {
  const products = await getLocalData<any[]>('products', []);
  return (products || []).filter(p => !p.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
};`;
const getProductsRepl = `export const getProducts = async () => {
  const products = await getLocalData<any[]>('products', []);
  const baseList = (products || []).filter(p => !p.isDeleted);
  
  const queue = getSyncQueue();
  let resultList = [...baseList];

  for (const task of queue) {
    if (task.operation === 'ADD_PRODUCT') {
       resultList.push({ ...task.payload, isLocalUnsynced: true });
    } else if (task.operation === 'UPDATE_PRODUCT') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) {
           resultList[idx] = { ...resultList[idx], ...task.payload.product, isLocalUnsynced: true };
       }
    } else if (task.operation === 'DELETE_PRODUCT') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) {
           resultList.splice(idx, 1);
       }
    }
  }

  return resultList.sort((a: any, b: any) => b.createdAt - a.createdAt);
};`;
code = code.replace(getProductsMatch, getProductsRepl);


// 4. getProductCategories
const getCategoriesMatch = `export const getProductCategories = async () => {
  const categories = await getLocalData<any[]>('product_categories', []);
  return categories.sort((a, b) => b.createdAt - a.createdAt);
};`;
const getCategoriesRepl = `export const getProductCategories = async () => {
  const categories = await getLocalData<any[]>('product_categories', []);
  
  const queue = getSyncQueue();
  let resultList = [...categories];

  for (const task of queue) {
    if (task.operation === 'ADD_PRODUCT_CATEGORY') {
       resultList.push({ ...task.payload, isLocalUnsynced: true });
    } else if (task.operation === 'UPDATE_PRODUCT_CATEGORY') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) {
           resultList[idx] = { ...resultList[idx], ...task.payload.category, isLocalUnsynced: true };
       }
    } else if (task.operation === 'DELETE_PRODUCT_CATEGORY') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) {
           resultList.splice(idx, 1);
       }
    }
  }

  return resultList.sort((a, b) => b.createdAt - a.createdAt);
};`;
code = code.replace(getCategoriesMatch, getCategoriesRepl);

// 5. Add wrappers
const wrappers = `
export const addProduct = async (product: any) => {
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const now = Date.now();
  const newProduct = { ...product, id: localId, createdAt: now, updatedAt: now };
  enqueueSyncTask('ADD_PRODUCT', newProduct);
  return newProduct;
};
export const updateProduct = async (id: string, product: any) => {
  enqueueSyncTask('UPDATE_PRODUCT', { id, product });
  return { ...product, id };
};
export const deleteProduct = async (id: string) => {
  enqueueSyncTask('DELETE_PRODUCT', { id });
};

export const addProductCategory = async (category: any) => {
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const now = Date.now();
  const newCategory = { ...category, id: localId, createdAt: now, updatedAt: now };
  enqueueSyncTask('ADD_PRODUCT_CATEGORY', newCategory);
  return newCategory;
};
export const updateProductCategory = async (id: string, category: any) => {
  enqueueSyncTask('UPDATE_PRODUCT_CATEGORY', { id, category });
  return { ...category, id };
};
export const deleteProductCategory = async (id: string) => {
  enqueueSyncTask('DELETE_PRODUCT_CATEGORY', { id });
};
`;

code = code + wrappers;

fs.writeFileSync('src/services/productService.ts', code);
console.log('productService patched');
