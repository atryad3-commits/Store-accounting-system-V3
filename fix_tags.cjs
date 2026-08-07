const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const replacement = `                                                   </button>
                                                 )}
                                               </div>
                                            </div>
                                         )}
                                         {inst.status === 'paid' && (`;

code = code.replace("                                                   </button>                                                 )}                                                                                        {inst.status === 'paid' && (", replacement);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
