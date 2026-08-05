const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const strToFind = `                                  حذف وام
                               </button>
                            )}`;

const replacement = `                                  حذف وام
                               </button>
                            )}
                         </div>`;

code = code.replace(strToFind, replacement);
fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
