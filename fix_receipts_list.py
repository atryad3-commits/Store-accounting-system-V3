with open("src/components/financial/ReceiptsList.tsx", "r") as f:
    content = f.read()

lines = content.split('\n')
start_idx = 0
for i, line in enumerate(lines):
    if line.strip() == "{":
        start_idx = i + 1
        break
    elif "{" in line:
        start_idx = i
        break

inner_content = "\n".join(lines[start_idx:-2])

imports = """import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import * as lucide from 'lucide-react';
const { Search, Plus, Filter, FileText, Download, CheckCircle, Edit2, Trash2, Printer, Check, X, ArrowUpRight, ArrowDownRight, ArrowRight, CornerDownLeft, Package, User, Clock, CheckCircle2, ChevronLeft, ChevronRight, Share2, Eye, Truck, MoreVertical, DollarSign, RefreshCw, XCircle } = lucide as any;

export default function ReceiptsList(props: any) {
  const {
    transactions, activeTab, persons, getPersonDisplayName, formatCurrency, formatDateDisplay, setViewingTransaction,
    renderPersonLink, storeSettings,
    ...rest
  } = props;
"""

with open("src/components/financial/ReceiptsList.tsx", "w") as f:
    f.write(imports + "\n" + inner_content + "\n        );\n}\n")
