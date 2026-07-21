import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

# Just to make sure we replace the whole file correctly, we will rewrite it entirely.
# Let's extract the imports and state first, then build the new component.
