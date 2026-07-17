const fs = require('fs');

const appFile = 'src/App.tsx';
let content = fs.readFileSync(appFile, 'utf8');

const buttonCode = `
                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="p-2 border rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border-slate-200"
                    title="ماشین حساب"
                  >
                    <Calculator className="w-5 h-5" />
                  </button>
`;

const insertIndex = content.indexOf('<button\n                    onClick={() => setSystemModule("selector")}');
if (insertIndex > -1) {
  content = content.substring(0, insertIndex) + buttonCode + content.substring(insertIndex);
  fs.writeFileSync(appFile, content, 'utf8');
  console.log('Button inserted');
} else {
  console.log('Target not found');
}
