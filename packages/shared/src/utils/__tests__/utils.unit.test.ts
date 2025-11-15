import {
  formatCurrency,
  generateId,
  isValidEmail,
  calculateLoanPayment,
} from '../index';

describe('Utils - Unit Tests', () => {
  describe('formatCurrency', () => {
    it('should format number as USD currency by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('should format number with custom currency', () => {
      expect(formatCurrency(1000, 'EUR')).toMatch(/€|EUR/);
    });

    it('should handle decimal values', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct format', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('invalid@domain')).toBe(false);
    });
  });

  describe('calculateLoanPayment', () => {
    it('should calculate monthly payment correctly', () => {
      const payment = calculateLoanPayment(10000, 5, 12);
      expect(payment).toBeCloseTo(856.07, 2);
    });

    it('should handle zero interest rate', () => {
      const payment = calculateLoanPayment(12000, 0, 12);
      expect(payment).toBe(1000);
    });

    it('should return positive values', () => {
      const payment = calculateLoanPayment(5000, 3.5, 24);
      expect(payment).toBeGreaterThan(0);
    });
  });
});
