import re

file = 'src/App.tsx'
with open(file, 'r') as f:
    content = f.read()

# Replace ProductModal classes
pattern = r'className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-2xl max-h-\[90vh\] flex flex-col"'
new_classes = 'className="bg-white md:rounded-2xl shadow-xl md:border border-gray-100 overflow-hidden w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] flex flex-col"'

content = re.sub(pattern, new_classes, content)

with open(file, 'w') as f:
    f.write(content)
