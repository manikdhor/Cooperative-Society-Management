export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  membershipNumber: string;
  joinDate: Date;
  status: MemberStatus;
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  interestRate: number;
  term: number;
  status: LoanStatus;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  REPAID = 'REPAID',
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
