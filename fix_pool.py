import re

with open('server.ts', 'r') as f:
    content = f.read()

pattern = r"(if \(business && business\.db_type === 'postgres'\) \{.*?\n\s*\} catch\(e\) )\{\}"
replacement = r"\1{ console.error('Caught error in loadPgPoolForStore for store', storeId, e); }"

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(new_content)
