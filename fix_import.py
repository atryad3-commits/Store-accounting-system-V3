import sys

file_path = 'src/components/loans/LoansManager.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Plus, Percent, Edit2, Trash2, Search, CheckCircle, ChevronDown, ChevronUp, AlertCircle, RefreshCw, Layers, Calendar, DollarSign, Wallet, Users, Activity, List, ArrowLeftRight } , Settings from 'lucide-react';", "import { Plus, Percent, Edit2, Trash2, Search, CheckCircle, ChevronDown, ChevronUp, AlertCircle, RefreshCw, Layers, Calendar, DollarSign, Wallet, Users, Activity, List, ArrowLeftRight, Settings } from 'lucide-react';")
content = content.replace("import { Printer, X } , Settings from 'lucide-react';", "import { Printer, X } from 'lucide-react';")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
