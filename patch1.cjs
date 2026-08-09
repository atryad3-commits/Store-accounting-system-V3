const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

// 1. Add SearchableSelect import
if (!content.includes('SearchableSelect')) {
    content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport SearchableSelect from '../ui/SearchableSelect';");
}

// 2. Replace person select
const selectRegex = /<select\s+value=\{formData\.personId\}[\s\S]*?<\/select>/;
const newSelect = `<SearchableSelect
                  value={formData.personId}
                  onChange={(val) => {
                    setFormData({...formData, personId: val});
                    setUseBalanceAsAmount(false);
                  }}
                  options={(persons || []).filter(p => p.isActive !== false).map(p => ({ value: p.id, label: p.name }))}
                  placeholder="انتخاب شخص..."
                  searchPlaceholder="جستجوی شخص..."
                />`;
content = content.replace(selectRegex, newSelect);

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
