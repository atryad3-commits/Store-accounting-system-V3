import re

with open("src/components/loans/InstallmentPaymentTerminal.tsx", "r") as f:
    content = f.read()

bad = """  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchCode.trim()) return;"""

good = """  const handleSearch = async (e?: React.FormEvent, codeToSearch?: string) => {
    if (e) e.preventDefault();
    const code = codeToSearch || searchCode;
    if (!code.trim()) return;"""

content = content.replace(bad, good)
content = content.replace("await lookupInstallmentByCode(searchCode.trim());", "await lookupInstallmentByCode(code.trim());")

effect_code = """  useEffect(() => {
    if (initialCode && step === 'search') {
      handleSearch(undefined, initialCode);
    }
  }, [initialCode]);

  const handleSearch"""
content = content.replace("  const handleSearch", effect_code, 1)

with open("src/components/loans/InstallmentPaymentTerminal.tsx", "w") as f:
    f.write(content)

