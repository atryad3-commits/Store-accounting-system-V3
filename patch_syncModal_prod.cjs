const fs = require('fs');
let code = fs.readFileSync('src/components/common/SyncStatusModal.tsx', 'utf8');

const labelMatch = `{task.operation.startsWith('ADD_PERSON') ? 'افزودن' :
                         task.operation.startsWith('UPDATE_PERSON') ? 'ویرایش' :
                         'حذف'}
                         {' '}
                         {task.operation.includes('GROUP') ? 'گروه‌بندی' :
                          task.operation.includes('ROLE') ? 'نقش' :
                          task.operation.includes('CATEGORY') ? 'دسته‌بندی' :
                          'شخص'}`;

const labelRepl = `{task.operation.startsWith('ADD') ? 'افزودن' :
                         task.operation.startsWith('UPDATE') ? 'ویرایش' :
                         'حذف'}
                         {' '}
                         {task.operation.includes('PRODUCT') 
                           ? (task.operation.includes('GROUP') ? 'گروه‌بندی کالا' 
                              : task.operation.includes('CATEGORY') ? 'دسته‌بندی کالا' 
                              : 'کالا')
                           : (task.operation.includes('GROUP') ? 'گروه‌بندی شخص' 
                              : task.operation.includes('ROLE') ? 'نقش' 
                              : task.operation.includes('CATEGORY') ? 'دسته‌بندی شخص' 
                              : 'شخص')
                         }`;

code = code.replace(labelMatch, labelRepl);
fs.writeFileSync('src/components/common/SyncStatusModal.tsx', code);
console.log('SyncStatusModal label updated for products');
