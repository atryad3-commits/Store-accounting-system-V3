import re

with open("src/services/coreService.ts", "r") as f:
    content = f.read()

content = content.replace("operations.forEach(op => invalidateCache(op.key));", 
"""operations.forEach(op => {
    invalidateCache(op.key);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('app_data_changed', { detail: { key: op.key } }));
});""")

with open("src/services/coreService.ts", "w") as f:
    f.write(content)
