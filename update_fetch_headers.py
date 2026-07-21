import re

with open('src/services/dataService.ts', 'r') as f:
    content = f.read()

def inject_header(match):
    headers_block = match.group(0)
    store_header = "        'x-store-id': localStorage.getItem('activeStoreId') || 'default',\n"
    if "x-store-id" not in headers_block:
        return headers_block.replace("headers: {", f"headers: {{\n{store_header}")
    return headers_block

content = re.sub(r'headers:\s*\{[^}]*\}', inject_header, content)

with open('src/services/dataService.ts', 'w') as f:
    f.write(content)
