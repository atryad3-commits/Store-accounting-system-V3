const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

// import CloudOff
code = code.replace(
  'import { motion } from "motion/react";',
  'import { motion } from "motion/react";\nimport { CloudOff } from "lucide-react";'
);

const displayNameMatch = `{getPersonDisplayName(p)}
                                                  {p.isActive === false && (`;

const displayNameRepl = `{getPersonDisplayName(p)}
                                                  {p.isLocalUnsynced && (
                                                    <span className="mr-2 inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md align-middle" title="ذخیره محلی - در صف ارسال">
                                                      <CloudOff className="w-3 h-3" />
                                                      در صف
                                                    </span>
                                                  )}
                                                  {p.isActive === false && (`;

code = code.replace(displayNameMatch, displayNameRepl);
fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
console.log('PersonsManager patched');
