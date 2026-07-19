import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# I will find `<AccountFormModal` or `<AccountsManager` or whatever and fix them if they have duplicate props.
# A simpler way is to just use regex to remove identical consecutive or nearby props.
# Let's just remove ALL `storeSettings={storeSettings}` that appear right after `confirmAction={confirmAction}\n                storeSettings={storeSettings}`
