const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const regex = /معوقه\s*<\/button>\s*\)\}\s*\{inst\.status === 'paid'/;
const replacement = `معوقه
                                                   </button>
                                                 )}
                                               </div>
                                            </div>
                                         )}
                                         {inst.status === 'paid'`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
    console.log("Replaced!");
} else {
    console.log("Not found!");
}
