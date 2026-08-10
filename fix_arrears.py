import re

with open("src/components/loans/LoansArrears.tsx", "r") as f:
    content = f.read()

bad1 = """import { AlertCircle, Clock, Search, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';"""
good1 = """import { AlertCircle, Clock, Search, Phone, MessageCircle, CheckCircle, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';"""
content = content.replace(bad1, good1)

bad2 = """export default function LoansArrears({ 
  formatCurrency = (val: number) => Number(val).toLocaleString("fa-IR") + " تومان",
  loans, installments, persons, storeSettings
}: LoansArrearsProps) {
  const [searchTerm, setSearchTerm] = useState('');"""
good2 = """export default function LoansArrears({ 
  formatCurrency = (val: number) => Number(val).toLocaleString("fa-IR") + " تومان",
  loans, installments, persons, storeSettings
}: LoansArrearsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');"""
content = content.replace(bad2, good2)

bad3 = """  const overdueInstallments = useMemo(() => {
    let overdue = installments
      .filter(i => i.status === 'pending' && i.dueDate < today)
      .map(inst => {
        const loan = loans.find(l => l.id === inst.loanId);
        const loanInsts = installments.filter(i => i.loanId === inst.loanId).sort((a,b) => a.dueDate.localeCompare(b.dueDate));"""
good3 = """  const overdueInstallments = useMemo(() => {
    let overdue = installments
      .filter(i => {
        if (i.status !== 'pending' && i.status !== 'overdue') return false;
        if (i.dueDate >= today) return false;
        const loan = loans.find(l => l.id === i.loanId);
        if (!loan || (loan.status !== 'active' && loan.status !== 'overdue')) return false;
        return true;
      })
      .map(inst => {
        const loan = loans.find(l => l.id === inst.loanId);
        const loanInsts = installments.filter(i => i.loanId === inst.loanId).sort((a,b) => a.dueDate.localeCompare(b.dueDate));"""
content = content.replace(bad3, good3)

bad4 = """                  <td className="px-6 py-4">
                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        ثبت پیگیری
                     </button>
                  </td>"""
good4 = """                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        ثبت پیگیری
                     </button>
                     <button 
                        onClick={() => navigate(`/loans_payment?code=${inst.installmentCode}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                        <CreditCard className="w-3.5 h-3.5" />
                        پرداخت قسط
                     </button>
                    </div>
                  </td>"""
content = content.replace(bad4, good4)

with open("src/components/loans/LoansArrears.tsx", "w") as f:
    f.write(content)

