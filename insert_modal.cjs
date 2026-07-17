const fs = require('fs');

const appFile = 'src/App.tsx';
let content = fs.readFileSync(appFile, 'utf8');

const modalCode = `
      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </>
  );
`;

content = content.replace('    </>\n  );', modalCode);
fs.writeFileSync(appFile, content, 'utf8');
console.log('Modal inserted');
