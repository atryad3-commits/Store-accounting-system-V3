import sys

with open('server.ts', 'r') as f:
    content = f.read()

old_code = """    // For other stores
    try {
        let business = null;
        if (usePgMap['default'] && activePgPools['default']) {"""

new_code = """    // For other stores
    try {
        if (activePgPools['default'] === undefined) {
            await loadPgPoolForStore('default');
        }
        let business = null;
        if (usePgMap['default'] && activePgPools['default']) {"""

content = content.replace(old_code, new_code)

with open('server.ts', 'w') as f:
    f.write(content)
