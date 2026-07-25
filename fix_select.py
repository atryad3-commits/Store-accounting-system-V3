import os
import re

filepath = "src/components/ui/SearchableSelect.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add menuPlacement to SearchableSelectProps
content = content.replace("disabled?: boolean;\n}", "disabled?: boolean;\n  menuPlacement?: 'top' | 'bottom';\n}")

# Add menuPlacement to component signature
content = content.replace("disabled = false\n}: SearchableSelectProps) {", "disabled = false,\n  menuPlacement = 'bottom'\n}: SearchableSelectProps) {")

# Update motion.div className and animation based on menuPlacement
content = content.replace("className=\"absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col\"",
                          "className={`absolute z-50 w-full ${menuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col`}")

content = content.replace("initial={{ opacity: 0, y: -10 }}", "initial={{ opacity: 0, y: menuPlacement === 'top' ? 10 : -10 }}")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
