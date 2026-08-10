export function generateInstallmentCode(loanId: string | number, loanNumber: string | undefined, index: number, dueDate: string): string {
    const year = dueDate.split('-')[0] || new Date().getFullYear().toString();
    const ref = loanNumber || loanId.toString().substring(0, 5).toUpperCase();
    const inst = String(index + 1).padStart(2, '0');
    const base = `LN-${year}-${ref}-${inst}`;
    
    // Checksum: Modulo 97 over character codes
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
        sum += base.charCodeAt(i);
    }
    const check = (sum % 97).toString().padStart(2, '0');
    
    return `${base}${check}`;
}
