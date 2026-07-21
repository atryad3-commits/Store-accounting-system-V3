import sys

with open('server.ts', 'r') as f:
    content = f.read()

old_code = "} catch(e) {}"
new_code = "} catch(e) { console.error('ERROR in loadPgPoolForStore:', e); }"

content = content.replace(old_code, new_code)

with open('server.ts', 'w') as f:
    f.write(content)
