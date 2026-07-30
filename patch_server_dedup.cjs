const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`         const data = (await getDbData(key)) || [];
         if (Array.isArray(data)) {
           data.push(newItem);
           await setDbData(key, data);
         } else {`,
`         const data = (await getDbData(key)) || [];
         if (Array.isArray(data)) {
           const idx = data.findIndex((x: any) => String(x.id) === String(newItem.id));
           if (idx !== -1) {
               data[idx] = { ...data[idx], ...newItem };
           } else {
               data.push(newItem);
           }
           await setDbData(key, data);
         } else {`
);

code = code.replace(
`         for (const op of keyOps) {
            if (op.type === 'append') {
               data.push(op.data);
               results.push({ id: op.data.id, status: 'appended' });`,
`         for (const op of keyOps) {
            if (op.type === 'append') {
               const idx = data.findIndex((x: any) => String(x.id) === String(op.data.id));
               if (idx !== -1) {
                   data[idx] = { ...data[idx], ...op.data };
               } else {
                   data.push(op.data);
               }
               results.push({ id: op.data.id, status: 'appended' });`
);

fs.writeFileSync('server.ts', code);
console.log('patched server.ts');
