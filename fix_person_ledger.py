with open("src/components/persons/PersonLedgerActionsDropdown.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "import { MoreVertical, DownloadCloud, Activity, Settings, Printer, Edit2, ShoppingCart, RefreshCw, Send, X, Package, Shield, Share2 } from 'lucide-react';",
    "import { MoreVertical, DownloadCloud, Activity, Settings, Printer, Edit2, ShoppingCart, RefreshCw, Send, X, Package, Shield, Share2, ChevronDown, FileText, ArrowDownToLine, ArrowUpFromLine, Download } from 'lucide-react';"
)

with open("src/components/persons/PersonLedgerActionsDropdown.tsx", "w") as f:
    f.write(content)
