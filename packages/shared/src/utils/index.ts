export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termInMonths: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / termInMonths;
  
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
    (Math.pow(1 + monthlyRate, termInMonths) - 1);
  
  return Math.round(payment * 100) / 100;
}
