import re

with open("src/components/loans/InstallmentBookletPrint.tsx", "r") as f:
    content = f.read()

# Replace useReactToPrint with window.print()
bad = """import { useReactToPrint } from 'react-to-print';"""
good = """// import { useReactToPrint } from 'react-to-print';"""
content = content.replace(bad, good)

bad2 = """  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `دفترچه_اقساط_وام_${loan.loanNumber || loan.id}`,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; direction: rtl; }
      }
    `,
  });"""
good2 = """  const handlePrint = () => {
    document.title = `دفترچه_اقساط_وام_${loan.loanNumber || loan.id}`;
    setTimeout(() => {
        window.print();
        document.title = "Applet";
    }, 100);
  };"""
content = content.replace(bad2, good2)

with open("src/components/loans/InstallmentBookletPrint.tsx", "w") as f:
    f.write(content)

