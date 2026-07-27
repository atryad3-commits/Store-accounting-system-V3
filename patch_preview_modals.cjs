const fs = require('fs');
let content = fs.readFileSync('src/components/modals/PreviewModals.tsx', 'utf8');

// 1. Add paperSize to state
content = content.replace(
  `designType: 'classic' // classic or modern
  });`,
  `designType: 'classic', // classic or modern
    paperSize: 'a4' // a4 or a5
  });`
);

// 2. Add paperSize selector to desktop settings
content = content.replace(
  `<select 
                    value={printSettings.designType}`,
  `<select 
                    value={printSettings.paperSize}
                    onChange={(e) => setPrintSettings(s => ({...s, paperSize: e.target.value}))}
                    className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none"
                  >
                    <option value="a4">سایز A4</option>
                    <option value="a5">سایز A5</option>
                  </select>
                  <select 
                    value={printSettings.designType}`
);

// 3. Add paperSize selector to mobile settings
content = content.replace(
  `<select 
                value={printSettings.designType}`,
  `<select 
                value={printSettings.paperSize}
                onChange={(e) => setPrintSettings(s => ({...s, paperSize: e.target.value}))}
                className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none"
              >
                <option value="a4">سایز A4</option>
                <option value="a5">سایز A5</option>
              </select>
              <select 
                value={printSettings.designType}`
);

// 4. Update the preview container to change its size based on paperSize
content = content.replace(
  `className="bg-white rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none overflow-hidden mx-auto max-w-[210mm] min-h-[297mm] print:w-full print:max-w-none print:min-h-0"`,
  `className={\`bg-white rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none mx-auto print:w-full print:max-w-none \${printSettings.paperSize === 'a5' ? 'max-w-[148mm] min-h-[210mm] print:min-h-0' : 'max-w-[210mm] min-h-[297mm] print:min-h-0'}\`}`
);

fs.writeFileSync('src/components/modals/PreviewModals.tsx', content);
console.log("Patched PreviewModals");
