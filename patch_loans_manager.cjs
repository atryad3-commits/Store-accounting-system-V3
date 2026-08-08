const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

// 1. Import LoanStatusModal
content = content.replace(
  "import InstallmentBookletPrint from './InstallmentBookletPrint';",
  "import InstallmentBookletPrint from './InstallmentBookletPrint';\nimport LoanStatusModal from './LoanStatusModal';"
);

// 2. Add states for selectedLoanForPayment and statusModalLoanId
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'create' | 'arrears' | 'reports' | 'settings'>('dashboard');",
  "const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'create' | 'payment' | 'arrears' | 'reports' | 'settings'>('dashboard');\n  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState<string>('');\n  const [statusModalLoanId, setStatusModalLoanId] = useState<string | null>(null);"
);

// 3. Define finalApprovedLoans
content = content.replace(
  "return (",
  "const finalApprovedLoans = loans.filter(l => ['approved', 'active', 'completed', 'overdue'].includes(l.status));\n\n  return ("
);

// 4. Update the render of Dashboard, Arrears, Reports to use finalApprovedLoans
content = content.replace(
  "<LoansDashboard formatCurrency={formatCurrency} loans={loans} installments={installments} persons={persons} storeSettings={storeSettings} />",
  "<LoansDashboard formatCurrency={formatCurrency} loans={finalApprovedLoans} installments={installments} persons={persons} storeSettings={storeSettings} />"
);
content = content.replace(
  "<LoansArrears formatCurrency={formatCurrency} loans={loans} installments={installments} persons={persons} />",
  "<LoansArrears formatCurrency={formatCurrency} loans={finalApprovedLoans} installments={installments} persons={persons} />"
);
content = content.replace(
  "<LoansReports formatCurrency={formatCurrency} loans={loans} installments={installments} persons={persons} />",
  "<LoansReports formatCurrency={formatCurrency} loans={finalApprovedLoans} installments={installments} persons={persons} />"
);

// 5. Update LoansPayment to pass initialLoanId
content = content.replace(
  "storeSettings={storeSettings}",
  "storeSettings={storeSettings}\n             initialLoanId={selectedLoanForPayment}"
);

// 6. Rewrite the row rendering in filteredLoans.map
const startMapRegex = /filteredLoans\.map\(loan => \{([\s\S]*?)return \([\s\S]*?<div key=\{loan\.id\} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-gray-200">([\s\S]*?)<\/div>\s*<\/div>\s*<\/?AnimatePresence>\s*\{isExpanded([\s\S]*?)<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*<\/div>\s*\);\s*\}\)/;

let replacement = `filteredLoans.map(loan => {
               const loanInsts = (installments || []).filter(i => i.loanId === loan.id);
               const paidInsts = loanInsts.filter(i => i.status === 'paid').length;
               const totalInsts = loanInsts.length;

               return (
                 <div key={loan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-gray-200 hover:shadow-md cursor-pointer" onClick={() => { setSelectedLoanForPayment(loan.id as string); setActiveTab('payment'); }}>
                    <div className="p-6 flex flex-col lg:flex-row items-center gap-6">
                       
                       <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{backgroundColor: loan.type === 'given' ? '#eff6ff' : '#ecfdf5'}}>
                          <Wallet className={\`w-7 h-7 \${loan.type === 'given' ? 'text-blue-500' : 'text-emerald-500'}\`}/>
                       </div>

                       <div className="flex-1 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                         
                         <div>
                            <div className="flex items-center gap-3 mb-1.5">
                               <h3 className="text-lg font-black text-gray-800">{getPersonName(loan.personId)}</h3>
                               <span className={\`px-2.5 py-1 rounded-lg text-xs font-black \${loan.type === 'given' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}\`}>
                                  {loan.type === 'given' ? 'پرداختی' : 'دریافتی'}
                               </span>
                               <span className={\`px-2.5 py-1 rounded-lg text-xs font-black \${LOAN_STATUS_COLORS[loan.status] || 'bg-gray-100 text-gray-600'}\`}>{LOAN_STATUS_LABELS[loan.status] || 'نامشخص'}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                               <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> تاریخ: {formatDateDisplay(loan.startDate.replace(/-/g, '/'))}</span>
                               <span className="flex items-center gap-1.5"><Layers className="w-4 h-4"/> اقساط: {totalInsts} {loan.frequency === 'yearly' ? '(سالانه)' : loan.frequency === 'quarterly' ? '(فصلی)' : '(ماهانه)'}</span>
                               {loan.interestRate && <span className="flex items-center gap-1.5"><Percent className="w-4 h-4"/> سود: {loan.interestRate}٪</span>}
                            </div>
                         </div>

                         <div className="flex flex-col md:items-end gap-1">
                            <span className="text-xl font-black font-mono text-gray-900 tracking-tight" dir="ltr">{formatCurrency(loan.amount)}</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                               <span>پرداخت شده: {paidInsts} از {totalInsts}</span>
                               <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{width: \`\${(paidInsts/totalInsts)*100}%\`}}></div>
                               </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                 onClick={(e) => { e.stopPropagation(); setStatusModalLoanId(loan.id as string); }}
                                 className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Activity className="w-4 h-4" />
                                  تغییر وضعیت
                               </button>
                              <button
                                 onClick={(e) => { e.stopPropagation(); setPrintingLoanId(loan.id as string); }}
                                 className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Printer className="w-4 h-4" />
                                  چاپ دفترچه
                               </button>
                              {(userRole === 'admin' || userRole === 'manager') && (
                               <button
                                 onClick={(e) => { e.stopPropagation(); handleDeleteLoan(loan.id); }}
                                 className="text-rose-500 hover:text-rose-700 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Trash2 className="w-4 h-4" />
                                  حذف وام
                               </button>
                             )}
                            </div>
                         </div>
                       </div>
                    </div>
                 </div>
               );
            })`;

content = content.replace(startMapRegex, replacement);

// 7. Add LoanStatusModal usage at the bottom, just before AnimatePresence of print booklet
content = content.replace(
  "{printingLoanId && (",
  `{statusModalLoanId && (
          <LoanStatusModal
            isOpen={true}
            onClose={() => setStatusModalLoanId(null)}
            loan={loans.find(l => l.id === statusModalLoanId) as Loan}
            onUpdateStatus={async (id, newStatus) => {
               await handleUpdateLoanStatus(id, newStatus);
               setStatusModalLoanId(null);
            }}
          />
        )}
        {printingLoanId && (`
);


fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
