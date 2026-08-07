const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const filterLogic = `
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = getPersonName(loan.personId).toLowerCase().includes(searchQuery.toLowerCase()) || loan.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
`;

code = code.replace(
    "return (    <div className=\"flex flex-col h-full bg-slate-50\">",
    filterLogic + "\n  return (    <div className=\"flex flex-col h-full bg-slate-50\">"
);

const searchUI = `
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
             <div className="relative flex-1">
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="text"
                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                 placeholder="جستجو در وام‌ها (نام شخص یا شماره وام)..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <div className="w-full sm:w-48">
               <select
                 className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option value="all">همه وضعیت‌ها</option>
                 <option value="requested">درخواست</option>
                 <option value="incomplete">نقص پرونده</option>
                 <option value="completed_dossier">تکمیل پرونده</option>
                 <option value="approved">تایید شده</option>
                 <option value="active">پرداخت شده / در جریان</option>
                 <option value="completed">تسویه شده</option>
                 <option value="overdue">معوق</option>
               </select>
             </div>
          </div>
`;

code = code.replace(
    /\{activeTab === 'list' && \(\s*<motion\.div\s*initial=\{\{ opacity: 0 \}\}\s*animate=\{\{ opacity: 1 \}\}\s*className="space-y-6"\s*>\s*\{loans\.length === 0 \? \(/,
    `{activeTab === 'list' && (
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           className="space-y-6"
        >
          ${searchUI}
          {filteredLoans.length === 0 ? (`
);

code = code.replace(
    /loans\.map\(loan => \{/g,
    "filteredLoans.map(loan => {"
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
