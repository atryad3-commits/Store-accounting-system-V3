import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('activeTab === "create_sale"')
if start_idx == -1: print("not found"); sys.exit(0)
# Look for the rendering blocks... wait, the router is:
# activeTab === "create_sale" || activeTab === "create_purchase" ...
