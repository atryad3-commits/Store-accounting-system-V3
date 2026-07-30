const fs = require('fs');
let code = fs.readFileSync('src/components/products/ProductsTab.tsx', 'utf8');

// import CloudOff
code = code.replace(
  'import { motion, AnimatePresence } from "motion/react";',
  'import { motion, AnimatePresence } from "motion/react";\nimport { CloudOff } from "lucide-react";'
);

const nameMatch = `{p.name}
                                          </button>
                                          {p.isActive === false && (`;

const nameRepl = `{p.name}
                                          </button>
                                          {p.isLocalUnsynced && (
                                            <span className="mr-2 inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-200/50 align-middle shrink-0" title="ذخیره محلی - در صف ارسال">
                                              <CloudOff className="w-3 h-3" />
                                              در صف
                                            </span>
                                          )}
                                          {p.isActive === false && (`;

code = code.replace(nameMatch, nameRepl);
fs.writeFileSync('src/components/products/ProductsTab.tsx', code);
console.log('ProductsTab patched');
