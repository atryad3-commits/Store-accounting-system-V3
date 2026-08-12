const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansArrears.tsx', 'utf8');

code = code.replace(/const \[searchTerm, setSearchTerm\] = useState\(''\);/, `const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'overdue'|'all'>('overdue');
  const [dateFilter, setDateFilter] = useState('');`);

code = code.replace(/const overdueInstallments = useMemo\(\(\) => \{[\s\S]*?\}, \[installments, loans, persons, today, searchTerm\]\);/, 
`const overdueInstallments = useMemo(() => {
    let overdue = installments
      .filter(i => {
        if (filterType === 'overdue') {
            if (i.status !== 'pending' && i.status !== 'overdue') return false;
            if (i.dueDate >= today) return false;
        }
        
        const loan = loans.find(l => l.id === i.loanId);
        if (!loan || (loan.status !== 'active' && loan.status !== 'overdue')) return false;
        return true;
      })
      .map(inst => {
        const loan = loans.find(l => l.id === inst.loanId);
        const loanInsts = installments.filter(i => i.loanId === inst.loanId).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
        const installmentNumber = loanInsts.findIndex(i => i.id === inst.id) + 1;
        const person = persons.find(p => p.id === loan?.personId);
        
        // Calculate days overdue
        const daysOverdue = calculateDaysPastDue(inst.dueDate);
        return {
          ...inst,
          loan,
          person,
          daysOverdue: daysOverdue < 0 ? 0 : daysOverdue,
          installmentNumber
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      overdue = overdue.filter(i => i.person?.name.toLowerCase().includes(lower) || i.loan?.loanNumber?.toString().includes(lower) || i.loan?.id.toString().includes(lower) || i.installmentCode?.toString().includes(lower) || i.person?.phone?.includes(lower));
    }
    
    if (dateFilter) {
      overdue = overdue.filter(i => i.dueDate === dateFilter);
    }
    
    return overdue;
  }, [installments, loans, persons, today, searchTerm, filterType, dateFilter]);`);
  
code = code.replace(/<div className="relative w-full sm:w-96">/, `<div className="flex gap-2 w-full sm:w-auto"><div className="relative w-full sm:w-96">`);
code = code.replace(/<Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" \/>\s*<\/div>/, `<Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
          <select 
             value={filterType} 
             onChange={e => setFilterType(e.target.value as 'overdue'|'all')}
             className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
             <option value="overdue">فقط معوقات (سررسید گذشته)</option>
             <option value="all">همه اقساط</option>
          </select>
          <input 
             type="date"
             value={dateFilter}
             onChange={e => setDateFilter(e.target.value)}
             className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
          {dateFilter && <button onClick={() => setDateFilter('')} className="px-3 py-2 text-rose-600 bg-rose-50 rounded-xl text-sm">حذف تاریخ</button>}
          </div>`);
          
fs.writeFileSync('src/components/loans/LoansArrears.tsx', code);
