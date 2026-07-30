const ts = require('typescript');
const fs = require('fs');
const code = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf8');
const result = ts.transpileModule(code, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});
const lines = result.outputText.split('\n');
const match = lines.findIndex(l => l.includes('document.body'));
console.log('Compiled JS around document.body:');
for(let i=match-2; i<=match+2; i++) {
  console.log(lines[i]);
}
