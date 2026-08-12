const fs = require('fs');

const path = 'src/utils/penaltyUtils.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /penaltyTotal \+= calculatePenalty\(loan, inst\);/g,
    `penaltyTotal += Math.max(0, calculatePenalty(loan, inst) - (inst.penaltyPaidAmount || 0));`
);

fs.writeFileSync(path, code);
