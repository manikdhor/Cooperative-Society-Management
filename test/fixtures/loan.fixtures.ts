import { Loan, LoanStatus } from '@coop/shared';

export function createLoanFixture(overrides?: Partial<Loan>): Loan {
  const timestamp = Date.now();
  return {
    id: `loan-${timestamp}`,
    memberId: `member-${timestamp}`,
    amount: 10000,
    interestRate: 5,
    term: 12,
    status: LoanStatus.PENDING,
    applicationDate: new Date(),
    ...overrides,
  };
}

export function createLoanListFixture(count: number, memberId?: string): Loan[] {
  return Array.from({ length: count }, (_, index) =>
    createLoanFixture({
      memberId: memberId || `member-${index}`,
      amount: 5000 + index * 1000,
      term: 12 + index * 6,
    })
  );
}

export const loanFixtures = {
  pendingLoan: createLoanFixture(),
  approvedLoan: createLoanFixture({
    status: LoanStatus.APPROVED,
    approvalDate: new Date(),
  }),
  disbursedLoan: createLoanFixture({
    status: LoanStatus.DISBURSED,
    approvalDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    disbursementDate: new Date(),
  }),
  rejectedLoan: createLoanFixture({
    status: LoanStatus.REJECTED,
  }),
  repaidLoan: createLoanFixture({
    status: LoanStatus.REPAID,
    approvalDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    disbursementDate: new Date(Date.now() - 358 * 24 * 60 * 60 * 1000),
  }),
};
