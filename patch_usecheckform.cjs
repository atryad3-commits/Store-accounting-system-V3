const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/useCheckForm.ts', 'utf8');

const strictValidTransitions = `
  const getValidTransitions = (type: 'issued' | 'received', currentStatus: string) => {
    if (type === 'issued') {
      switch(currentStatus) {
        case 'blank': return ['issued', 'cancelled'];
        case 'issued': return ['cashed', 'bounced', 'cancelled'];
        case 'cashed': return [];
        case 'bounced': return ['cancelled'];
        case 'cancelled': return [];
        default: return [];
      }
    } else {
      switch(currentStatus) {
        case 'received': return ['deposited', 'assigned', 'returned'];
        case 'deposited': return ['cashed', 'bounced', 'received'];
        case 'cashed': return [];
        case 'assigned': return ['bounced_assigned'];
        case 'bounced_assigned': return ['returned'];
        case 'bounced': return ['returned', 'deposited'];
        case 'returned': return [];
        default: return [];
      }
    }
  };
`;

file = file.replace(
  /const getValidTransitions = \(type: 'issued' \| 'received', currentStatus: string\) => \{[\s\S]*?\};\n/,
  strictValidTransitions.trim() + '\n'
);

fs.writeFileSync('src/components/financial/checks/useCheckForm.ts', file);
