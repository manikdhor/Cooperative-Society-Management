import { Loan, LoanStatus, generateId, calculateLoanPayment } from '@coop/shared';

export class LoanService {
  private loans: Map<string, Loan> = new Map();

  async createLoan(data: Omit<Loan, 'id' | 'applicationDate' | 'status'>): Promise<Loan> {
    const loan: Loan = {
      id: generateId(),
      ...data,
      applicationDate: new Date(),
      status: LoanStatus.PENDING,
    };
    
    this.loans.set(loan.id, loan);
    return loan;
  }

  async getLoanById(id: string): Promise<Loan | null> {
    return this.loans.get(id) || null;
  }

  async getAllLoans(): Promise<Loan[]> {
    return Array.from(this.loans.values());
  }

  async getLoansByMemberId(memberId: string): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.memberId === memberId);
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<Loan | null> {
    const loan = this.loans.get(id);
    if (!loan) return null;

    const updatedLoan = { ...loan, ...data, id };
    this.loans.set(id, updatedLoan);
    return updatedLoan;
  }

  async approveLoan(id: string): Promise<Loan | null> {
    const loan = this.loans.get(id);
    if (!loan || loan.status !== LoanStatus.PENDING) return null;

    const updatedLoan = {
      ...loan,
      status: LoanStatus.APPROVED,
      approvalDate: new Date(),
    };
    this.loans.set(id, updatedLoan);
    return updatedLoan;
  }

  async calculateMonthlyPayment(loanId: string): Promise<number | null> {
    const loan = this.loans.get(loanId);
    if (!loan) return null;

    return calculateLoanPayment(loan.amount, loan.interestRate, loan.term);
  }
}
