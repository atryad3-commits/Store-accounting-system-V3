import re

with open('src/components/persons/PersonsManager.tsx', 'r') as f:
    content = f.read()

is_mobile_code = """
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const effectiveViewMode = isMobile ? "list" : personsViewMode;
"""

content = content.replace('  const [openPersonActionsId, setOpenPersonActionsId] = useState<any>(null);', '  const [openPersonActionsId, setOpenPersonActionsId] = useState<any>(null);\n' + is_mobile_code)

# Replace all occurrences of personsViewMode with effectiveViewMode inside the JSX, EXCEPT for the toggle buttons.
# Actually, the toggle buttons use `personsViewMode` but we should hide them on mobile.
content = content.replace('personsViewMode === "list" ? (', 'effectiveViewMode === "list" ? (')
content = content.replace('personsViewMode === "grid"', 'effectiveViewMode === "grid"')
content = content.replace('personsViewMode === "table"', 'effectiveViewMode === "table"')

with open('src/components/persons/PersonsManager.tsx', 'w') as f:
    f.write(content)
