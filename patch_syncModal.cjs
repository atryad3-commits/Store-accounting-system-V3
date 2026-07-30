const fs = require('fs');
let code = fs.readFileSync('src/components/common/SyncStatusModal.tsx', 'utf8');

const opLabelMatch = `                        {task.operation === 'ADD_PERSON' ? 'افزودن شخص' :
                         task.operation === 'UPDATE_PERSON' ? 'ویرایش شخص' :
                         'حذف شخص'}
                      </span>`;

const opLabelRepl = `                        {task.operation.startsWith('ADD_PERSON') ? 'افزودن' :
                         task.operation.startsWith('UPDATE_PERSON') ? 'ویرایش' :
                         'حذف'}
                         {' '}
                         {task.operation.includes('GROUP') ? 'گروه‌بندی' :
                          task.operation.includes('ROLE') ? 'نقش' :
                          task.operation.includes('CATEGORY') ? 'دسته‌بندی' :
                          'شخص'}
                      </span>`;

code = code.replace(opLabelMatch, opLabelRepl);

const opColorMatch = `                        task.operation === 'ADD_PERSON' ? 'bg-emerald-100 text-emerald-700' :
                        task.operation === 'UPDATE_PERSON' ? 'bg-blue-100 text-blue-700' :
                        'bg-rose-100 text-rose-700'
                      }\`}>`;

const opColorRepl = `                        task.operation.startsWith('ADD') ? 'bg-emerald-100 text-emerald-700' :
                        task.operation.startsWith('UPDATE') ? 'bg-blue-100 text-blue-700' :
                        'bg-rose-100 text-rose-700'
                      }\`}>`;

code = code.replace(opColorMatch, opColorRepl);

const payloadMatch = `                      <span className="text-sm font-medium text-slate-700">
                        {task.payload?.name || task.payload?.person?.name || task.payload?.id}
                      </span>`;

const payloadRepl = `                      <span className="text-sm font-medium text-slate-700">
                        {task.payload?.name || task.payload?.person?.name || task.payload?.group?.name || task.payload?.role?.name || task.payload?.category?.name || task.payload?.id}
                      </span>`;

code = code.replace(payloadMatch, payloadRepl);
fs.writeFileSync('src/components/common/SyncStatusModal.tsx', code);
console.log('SyncStatusModal patched');
