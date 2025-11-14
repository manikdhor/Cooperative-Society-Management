import { LoanService } from '../loan.service';
import { LoanStatus } from '@coop/shared';

describe('LoanService - Unit Tests', () => {
  let service: LoanService;

  beforeEach(() => {
    service = new LoanService();
  });

  describe('createLoan', () => {
    it('should create a new loan with generated id', async () => {
      const loanData = {
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      };

      const loan = await service.createLoan(loanData);

      expect(loan).toHaveProperty('id');
      expect(loan).toHaveProperty('applicationDate');
      expect(loan.status).toBe(LoanStatus.PENDING);
      expect(loan.amount).toBe(loanData.amount);
    });

    it('should set default status to PENDING', async () => {
      const loan = await service.createLoan({
        memberId: 'member-456',
        amount: 5000,
        interestRate: 4.5,
        term: 24,
      });

      expect(loan.status).toBe(LoanStatus.PENDING);
    });
  });

  describe('getLoanById', () => {
    it('should return loan by id', async () => {
      const created = await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });

      const found = await service.getLoanById(created.id);

      expect(found).toEqual(created);
    });

    it('should return null for non-existent id', async () => {
      const found = await service.getLoanById('non-existent');

      expect(found).toBeNull();
    });
  });

  describe('getAllLoans', () => {
    it('should return empty array when no loans', async () => {
      const loans = await service.getAllLoans();

      expect(loans).toEqual([]);
    });

    it('should return all loans', async () => {
      await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });
      await service.createLoan({
        memberId: 'member-456',
        amount: 5000,
        interestRate: 4.5,
        term: 24,
      });

      const loans = await service.getAllLoans();

      expect(loans).toHaveLength(2);
    });
  });

  describe('getLoansByMemberId', () => {
    it('should return loans for specific member', async () => {
      await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });
      await service.createLoan({
        memberId: 'member-123',
        amount: 5000,
        interestRate: 4.5,
        term: 24,
      });
      await service.createLoan({
        memberId: 'member-456',
        amount: 7500,
        interestRate: 5.5,
        term: 18,
      });

      const memberLoans = await service.getLoansByMemberId('member-123');

      expect(memberLoans).toHaveLength(2);
      expect(memberLoans.every(l => l.memberId === 'member-123')).toBe(true);
    });
  });

  describe('updateLoan', () => {
    it('should update existing loan', async () => {
      const created = await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });

      const updated = await service.updateLoan(created.id, {
        amount: 12000,
        term: 18,
      });

      expect(updated).not.toBeNull();
      expect(updated?.amount).toBe(12000);
      expect(updated?.term).toBe(18);
      expect(updated?.id).toBe(created.id);
    });

    it('should return null for non-existent loan', async () => {
      const updated = await service.updateLoan('non-existent', {
        amount: 5000,
      });

      expect(updated).toBeNull();
    });
  });

  describe('approveLoan', () => {
    it('should approve pending loan', async () => {
      const created = await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });

      const approved = await service.approveLoan(created.id);

      expect(approved).not.toBeNull();
      expect(approved?.status).toBe(LoanStatus.APPROVED);
      expect(approved?.approvalDate).toBeDefined();
    });

    it('should return null for non-existent loan', async () => {
      const approved = await service.approveLoan('non-existent');

      expect(approved).toBeNull();
    });

    it('should not approve already approved loan', async () => {
      const created = await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });

      await service.approveLoan(created.id);
      const secondApproval = await service.approveLoan(created.id);

      expect(secondApproval).toBeNull();
    });
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate monthly payment for loan', async () => {
      const created = await service.createLoan({
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      });

      const payment = await service.calculateMonthlyPayment(created.id);

      expect(payment).not.toBeNull();
      expect(payment).toBeGreaterThan(0);
    });

    it('should return null for non-existent loan', async () => {
      const payment = await service.calculateMonthlyPayment('non-existent');

      expect(payment).toBeNull();
    });
  });
});
