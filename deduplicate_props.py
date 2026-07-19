import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Find all JSX tags
def deduplicate(match):
    tag = match.group(0)
    # count storeSettings={storeSettings}
    count = tag.count('storeSettings={storeSettings}')
    if count > 1:
        # replace all but the first
        tag = tag.replace('storeSettings={storeSettings}', '', count - 1)
    return tag

content = re.sub(r'<[A-Z]\w+[^>]+>', deduplicate, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
