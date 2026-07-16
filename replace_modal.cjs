const fs = require('fs');
let code = fs.readFileSync('src/components/accounting/FinancialYearManager.tsx', 'utf-8');

const startStr = '{confirmCloseId && (';
const startIdx = code.indexOf(startStr);
if (startIdx !== -1) {
  // find the matching closing tag
  const endMarker = 'بله، سال مالی بسته شود\n                </button>\n              </div>\n            </motion.div>\n          </div>\n        )}';
  const endIdx = code.indexOf(endMarker);
  if (endIdx !== -1) {
    const fullEnd = endIdx + endMarker.length;
    const replacement = `<YearClosingChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        year={selectedYearForClose}
        onConfirm={(id: any) => {
          setIsChecklistOpen(false);
          handleCloseYear(id);
        }}
      />`;
    code = code.slice(0, startIdx) + replacement + code.slice(fullEnd);
    fs.writeFileSync('src/components/accounting/FinancialYearManager.tsx', code, 'utf-8');
    console.log("Replaced successfully!");
  } else {
    console.log("Could not find end marker");
  }
} else {
  console.log("Could not find start marker");
}
