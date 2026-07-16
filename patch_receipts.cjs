const fs = require('fs');

const files = [
  'src/components/financial/PayReceiptModal.tsx',
  'src/components/financial/ReceiveReceiptModal.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');

  // Add setIsPersonModalOpen to destructuring
  if (!code.includes('setIsPersonModalOpen,')) {
    code = code.replace(/setReceiptPersonId,/, "setReceiptPersonId, setIsPersonModalOpen,");
  }

  const oldSelect = `<Select
                      isRtl`;

  const newSelect = `<div className="flex gap-2">
                      <div className="flex-1">
                        <Select
                          isRtl`;

  const oldSelectEnd = `                    />
                    <input
                      type="hidden"
                      required
                      value={receiptPersonId}
                      onChange={() => {}}
                    />`;

  const newSelectEnd = `                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPersonModalOpen && setIsPersonModalOpen(true)}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl px-4 flex items-center justify-center transition-colors shadow-sm"
                        title="تعریف شخص جدید"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="hidden"
                      required
                      value={receiptPersonId}
                      onChange={() => {}}
                    />`;

  if (code.includes(oldSelect)) {
    code = code.replace(oldSelect, newSelect);
    code = code.replace(oldSelectEnd, newSelectEnd);
    
    // Also make sure UserPlus is imported
    if (!code.includes('UserPlus')) {
      code = code.replace('User,', 'User, UserPlus,');
    }

    fs.writeFileSync(file, code, 'utf-8');
    console.log('Patched', file);
  } else {
    console.log('Could not find pattern in', file);
  }
}
