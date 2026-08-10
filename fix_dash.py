import re

with open("src/components/loans/LoansDashboard.tsx", "r") as f:
    content = f.read()

bad1 = """    loans.forEach(loan => {
      if (loan.status === 'active') activeLoans++;
    });

    installments.forEach(inst => {
      if (inst.status === 'pending') {"""
good1 = """    loans.forEach(loan => {
      if (loan.status === 'active' || loan.status === 'overdue') activeLoans++;
    });

    installments.forEach(inst => {
      const loan = loans.find(l => l.id.toString() === inst.loanId.toString());
      if (!loan || (loan.status !== 'active' && loan.status !== 'overdue' && loan.status !== 'completed')) return;
      if (inst.status === 'pending' || inst.status === 'overdue') {"""
content = content.replace(bad1, good1)

bad2 = """    installments.forEach(inst => {
      // Extract YYYY-MM
      const month = inst.dueDate.substring(0, 7);"""
good2 = """    installments.forEach(inst => {
      const loan = loans.find(l => l.id.toString() === inst.loanId.toString());
      if (!loan || (loan.status !== 'active' && loan.status !== 'overdue' && loan.status !== 'completed')) return;
      // Extract YYYY-MM
      const month = inst.dueDate.substring(0, 7);"""
content = content.replace(bad2, good2)

bad3 = """             {installments.filter(i => i.status === 'pending' && i.dueDate < today).sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 10).map(inst => {"""
good3 = """             {installments.filter(i => {
                if (i.status !== 'pending' && i.status !== 'overdue') return false;
                if (i.dueDate >= today) return false;
                const loan = loans.find(l => l.id.toString() === i.loanId.toString());
                if (!loan || (loan.status !== 'active' && loan.status !== 'overdue' && loan.status !== 'completed')) return false;
                return true;
             }).sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 10).map(inst => {"""
content = content.replace(bad3, good3)

with open("src/components/loans/LoansDashboard.tsx", "w") as f:
    f.write(content)

