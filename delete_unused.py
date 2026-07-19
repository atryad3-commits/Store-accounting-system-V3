import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# delete handleSaveHistoryDate
content = re.sub(r'const handleSaveHistoryDate = async \(h: any\) => \{.*?\n  \};', '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
