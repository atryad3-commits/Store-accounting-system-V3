import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('{activeTab === "products" ? (')
end_idx = content.find(') : activeTab === "person_opening_balances" ? (', start_idx)

print(f"Products tab lines: {content.count(chr(10), 0, start_idx)} to {content.count(chr(10), 0, end_idx)}")

