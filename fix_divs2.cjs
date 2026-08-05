const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// The issue is around line 740, we have an extra `</div>` or two. Let's just fix the whole section for `isExpanded`.
// We have: 
//   </div>
//      </div>
//   </div>
// </div>
// <div className="text-gray-300">

code = code.replace(/                           \)}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="text-gray-300">/,
`                            )}
                         </div>
                       </div>
                       <div className="text-gray-300">`);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
