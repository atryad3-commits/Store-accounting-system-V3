import re

with open("src/services/coreService.ts", "r") as f:
    content = f.read()

def inject_event(content, func_name, success_code):
    # Find the function definition
    return content

content = content.replace("invalidateCache(key);", "invalidateCache(key);\n    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('app_data_changed', { detail: { key } }));")
content = content.replace("invalidateCache(op.key);", "invalidateCache(op.key);\n      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('app_data_changed', { detail: { key: op.key } }));")

# We also need to check `deleteLocalData` (wait, is there a deleteLocalData in coreService?)
with open("src/services/coreService.ts", "w") as f:
    f.write(content)
