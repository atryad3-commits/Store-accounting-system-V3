import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

# delete from 8728 to 8991
del lines[8727:8991]

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
