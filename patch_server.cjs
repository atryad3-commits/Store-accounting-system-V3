const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

const stateMachineLogic = `
         const oldItem = data[index];
         const newItem = { ...oldItem, ...updatedItem, id }; // ensure id is preserved
         
         // State Machine Validation for Checks
         if (key === 'issued_checks' || key === 'received_checks') {
             if (updatedItem.status && updatedItem.status !== oldItem.status) {
                 const type = key === 'issued_checks' ? 'issued' : 'received';
                 let allowed = [];
                 if (type === 'issued') {
                     switch(oldItem.status) {
                         case 'blank': allowed = ['issued', 'cancelled']; break;
                         case 'issued': allowed = ['cashed', 'bounced', 'cancelled']; break;
                         case 'cashed': allowed = []; break; // terminal
                         case 'bounced': allowed = ['cancelled']; break; // maybe cashed if redeposited, but strictly cancelled or terminal
                         case 'cancelled': allowed = []; break; // terminal
                         default: allowed = ['issued', 'cashed', 'bounced', 'cancelled'];
                     }
                 } else {
                     switch(oldItem.status) {
                         case 'received': allowed = ['deposited', 'assigned', 'returned']; break;
                         case 'deposited': allowed = ['cashed', 'bounced', 'received']; break; // 'received' if Bank returns it without bouncing
                         case 'cashed': allowed = []; break; // terminal
                         case 'assigned': allowed = ['bounced_assigned']; break;
                         case 'bounced_assigned': allowed = ['returned']; break;
                         case 'bounced': allowed = ['returned', 'deposited']; break; // can redeposit
                         case 'returned': allowed = []; break; // terminal
                         default: allowed = ['received', 'deposited', 'cashed', 'assigned', 'bounced_assigned', 'bounced', 'returned'];
                     }
                 }
                 if (!allowed.includes(updatedItem.status)) {
                     return res.status(400).json({ error: \`تغییر وضعیت غیرمجاز است.\` });
                 }
             }
         }
`;

file = file.replace(
  /const oldItem = data\[index\];\s*const newItem = \{ \.\.\.oldItem, \.\.\.updatedItem, id \}; \/\/ ensure id is preserved/,
  stateMachineLogic
);

// We need to do the same for the non-PG branch!
const stateMachineLogicNoPg = `
             const oldItem = data[index];
             const newItem = { ...oldItem, ...updatedItem };
             
             // State Machine Validation for Checks
             if (key === 'issued_checks' || key === 'received_checks') {
                 if (updatedItem.status && updatedItem.status !== oldItem.status) {
                     const type = key === 'issued_checks' ? 'issued' : 'received';
                     let allowed = [];
                     if (type === 'issued') {
                         switch(oldItem.status) {
                             case 'blank': allowed = ['issued', 'cancelled']; break;
                             case 'issued': allowed = ['cashed', 'bounced', 'cancelled']; break;
                             case 'cashed': allowed = []; break;
                             case 'bounced': allowed = ['cancelled']; break;
                             case 'cancelled': allowed = []; break;
                             default: allowed = ['issued', 'cashed', 'bounced', 'cancelled'];
                         }
                     } else {
                         switch(oldItem.status) {
                             case 'received': allowed = ['deposited', 'assigned', 'returned']; break;
                             case 'deposited': allowed = ['cashed', 'bounced', 'received']; break;
                             case 'cashed': allowed = []; break;
                             case 'assigned': allowed = ['bounced_assigned']; break;
                             case 'bounced_assigned': allowed = ['returned']; break;
                             case 'bounced': allowed = ['returned', 'deposited']; break;
                             case 'returned': allowed = []; break;
                             default: allowed = ['received', 'deposited', 'cashed', 'assigned', 'bounced_assigned', 'bounced', 'returned'];
                         }
                     }
                     if (!allowed.includes(updatedItem.status)) {
                         return res.status(400).json({ error: \`تغییر وضعیت غیرمجاز است.\` });
                     }
                 }
             }
             
             data[index] = newItem;
`;

file = file.replace(
  /const oldItem = data\[index\];\s*data\[index\] = \{ \.\.\.oldItem, \.\.\.updatedItem \};/,
  stateMachineLogicNoPg
);

fs.writeFileSync('server.ts', file);
