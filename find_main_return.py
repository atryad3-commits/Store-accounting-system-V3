with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith('return ('):
        # find the function it belongs to
        print(f"Line {i+1}: {line.strip()}")
