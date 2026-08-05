const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const strToFind = `                            )}
                         </div>
                            </div>
                         </div>
                       </div>
                       <div className="text-gray-300">`;

const replacement = `                            )}
                         </div>
                       </div>
                       <div className="text-gray-300">`;

code = code.replace(strToFind, replacement);
fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
