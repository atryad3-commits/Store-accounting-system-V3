import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_idx = content.find(') : activeTab === "update" ? (')
end_idx = content.find(') : activeTab === "quick_price_inquiry" ? (', start_idx)

print(f"Update tab lines: {content.count(chr(10), 0, start_idx)} to {content.count(chr(10), 0, end_idx)}")

