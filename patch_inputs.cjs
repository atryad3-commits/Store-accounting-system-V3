const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
const lines = content.split('\n');

const amountIndex = lines.findIndex(l => l.includes('<DollarSign className="w-4 h-4 text-gray-400" /> مبلغ کل وام'));
if (amountIndex !== -1) {
    // Wrap the input in a div
    const inputStart = amountIndex + 2; // <input
    // Find where input ends
    let inputEnd = inputStart;
    while (!lines[inputEnd].includes('/>') && inputEnd < lines.length) {
        inputEnd++;
    }
    
    // Add currency unit
    lines.splice(inputEnd + 1, 0, `                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{storeSettings?.currency || 'تومان'}</span>\n                </div>`);
    lines.splice(inputStart, 0, `                <div className="relative">`);
}

const installmentIndex = lines.findIndex(l => l.includes('مبلغ هر قسط (محاسبه خودکار)'));
if (installmentIndex !== -1) {
    const inputStart = installmentIndex + 2; // <input
    let inputEnd = inputStart;
    while (!lines[inputEnd].includes('/>') && inputEnd < lines.length) {
        inputEnd++;
    }
    
    lines.splice(inputEnd + 1, 0, `                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{storeSettings?.currency || 'تومان'}</span>\n                </div>`);
    lines.splice(inputStart, 0, `                <div className="relative">`);
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', lines.join('\n'));
