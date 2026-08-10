import re

with open("src/services/loanStateMachine.ts", "r") as f:
    content = f.read()

bad = """  // Update loan status
  const updatedLoan = { ...loan, status: targetStatus };
  const updatedLoans = loans.map(l => l.id === loan.id ? updatedLoan : l);"""

good = """  // Update loan status
  const historyEntry = {
    status: targetStatus,
    date: new Date().toISOString(),
    desc: reason || 'تغییر وضعیت',
    user: userId || 'سیستم'
  };
  const updatedLoan = { 
    ...loan, 
    status: targetStatus,
    history: [...(loan.history || []), historyEntry]
  };
  const updatedLoans = loans.map(l => l.id === loan.id ? updatedLoan : l);"""

content = content.replace(bad, good)
with open("src/services/loanStateMachine.ts", "w") as f:
    f.write(content)
