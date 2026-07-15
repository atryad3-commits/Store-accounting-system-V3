with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'export default function App()' in line:
        lines.insert(i+1, "  const isFastStocktaking = window.location.hash.startsWith('#fast-stocktaking');\n  if (isFastStocktaking) return <FastStocktakingMobile />;\n")
        break

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Done")
