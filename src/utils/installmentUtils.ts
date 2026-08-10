export function generateInstallmentCode(loanId: string | number, loanNumber: string | undefined, index: number, dueDate: string): string {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}
