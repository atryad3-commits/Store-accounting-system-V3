import sys
import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Find the exact start and end of sms_panel
start_idx = content.find(') : activeTab === "sms_panel" ? (')
if start_idx == -1:
    print("Could not find sms_panel start")
    sys.exit(1)

# we need to find the matching closing bracket or the next `) : activeTab ===`
end_idx = content.find(') : activeTab === "system_logs" ? (', start_idx)
if end_idx == -1:
    print("Could not find sms_panel end")
    sys.exit(1)

sms_panel_content = content[start_idx:end_idx]

print(f"Extracting SMS Panel from line {content.count(chr(10), 0, start_idx)} to {content.count(chr(10), 0, end_idx)}")

