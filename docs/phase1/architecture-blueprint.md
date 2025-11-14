# Phase 1 Architecture Blueprint
## Bangla-First SACCO Management Platform

**Version:** 1.0  
**Date:** 2024  
**Status:** Phase 1 - Foundation Layer

---

## Executive Summary

This document outlines the architectural foundation for a Bangla-first Savings and Credit Cooperative Organization (SACCO) management platform. The system is designed to serve cooperative societies in Bangladesh with culturally-adapted financial services, comprehensive member management, and regulatory compliance with MRA (Microcredit Regulatory Authority) MFI-DBMS requirements.

The Phase 1 implementation establishes core infrastructure and critical services necessary for member enrollment, savings management, loan origination, and financial accounting—all with linguistic and cultural localization for the Bangladeshi market.

---

## 1. System Vision & Constraints

### Vision
Build a scalable, microservice-based SACCO platform that:
- Operates primarily in Bangla while supporting English for administrative purposes
- Provides transparent, fair financial services to cooperative members
- Maintains regulatory compliance with MRA requirements for microfinance institutions
- Enables cooperative societies to manage members, savings, loans, and accounting efficiently
- Scales from single society deployments to multi-society regional operations

### Constraints

**Regulatory:**
- Must comply with MRA MFI-DBMS (Member-wise Fund Disbursement-wise Bilking System) requirements
- Must maintain audit trails for all financial transactions
- Must support interest calculation methods aligned with cooperative regulations
- Must enforce KYC (Know Your Customer) and AML (Anti-Money Laundering) requirements

**Technical:**
- Cloud-native architecture supporting Docker containerization
- Microservices must maintain strong data consistency for financial operations
- Real-time transaction processing with sub-second latencies
- Support for offline-first scenarios in low-connectivity environments

**Organizational:**
- Reduce implementation time through reusable components
- Enable multiple independent cooperative deployments
- Support future expansion to mobile-first platforms
- Minimize operational overhead through automation

---

## 2. Technology Stack

### Backend Services
- **Runtime:** Node.js (LTS)
- **Framework:** NestJS with microservices architecture
- **ORM:** TypeORM with strong typing for data consistency
- **Validation:** Class-Validator with custom Bangla-aware validators
- **API:** REST with potential gRPC for service-to-service communication

### Frontend
- **Framework:** React (latest LTS)
- **State Management:** Redux Toolkit or Zustand
- **UI Components:** Material-UI or Chakra UI with Bangla localization
- **Build Tool:** Vite for fast development and optimized production builds

### Package Management & Monorepo
- **Monorepo Tool:** pnpm workspaces for efficient dependency management
- **Version Control:** Git with semantic versioning
- **Package Registry:** Private npm registry (optional) for internal packages

### Data Storage
- **Relational Database:** MySQL 8+ with strict schema enforcement
- **In-Memory Cache:** Redis for session management and request caching
- **Message Broker:** RabbitMQ for asynchronous service communication

### Infrastructure & Deployment
- **Containerization:** Docker with multi-stage builds
- **Container Orchestration:** Docker Compose (Phase 1), Kubernetes-ready architecture
- **Service Discovery:** Environment-based configuration
- **CI/CD:** GitHub Actions or GitLab CI (deployment-ready structure)

### Observability
- **Logging:** Winston or Pino with structured logging
- **Monitoring:** Prometheus metrics with Grafana dashboards (Phase 2)
- **Tracing:** OpenTelemetry (Phase 2)
- **Error Tracking:** Sentry integration (optional)

---

## 3. System Architecture Overview

### Architecture Pattern: Event-Driven Microservices

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│              (React SPA, Mobile Web, Admin Portal)           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│            API Gateway Service                               │
│  (Request routing, rate limiting, authentication check)      │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┬─────────────┬──────────────┐
         │           │           │             │              │
    ┌────▼────┐  ┌───▼───┐  ┌───▼────┐  ┌────▼────┐  ┌─────▼─────┐
    │   Auth  │  │Member │  │Savings │  │  Loan   │  │Accounting │
    │ Service │  │Service│  │Service │  │ Service │  │ Service   │
    └────┬────┘  └───┬───┘  └───┬────┘  └────┬────┘  └─────┬─────┘
         │           │          │            │             │
         └───────────┼──────────┼────────────┼─────────────┘
                     │
              ┌──────▼──────┐
              │  RabbitMQ   │ (Async Event Bus)
              └──────┬──────┘
                     │
         ┌───────────┼───────────┬─────────────┐
         │           │           │             │
    ┌────▼────┐  ┌───▼────┐  ┌──▼────────┐  ┌─▼──────────┐
    │Notification│  │Reports │  │Compliance │  │Audit Log  │
    │ Service   │  │Service │  │ Service   │  │Service    │
    └──────────┘  └────────┘  └───────────┘  └───────────┘
         │           │           │
         └───────────┼───────────┘
                     │
              ┌──────▼──────────┐
              │  MySQL 8+       │ (Shared Data Layer)
              │  Redis Cache    │
              └─────────────────┘
```

---

## 4. Service Boundaries & Responsibilities

### 4.1 API Gateway Service
**Responsibility:** Request orchestration, authentication, routing, and rate limiting

**Key Responsibilities:**
- Route HTTP requests to appropriate backend services
- Enforce authentication tokens (JWT)
- Apply rate limiting per user/organization
- Transform request/response formats
- Handle CORS and security headers
- Maintain request tracing context

**API Endpoints (v1):**
- `/api/v1/auth/*` → Auth Service
- `/api/v1/members/*` → Member Service
- `/api/v1/savings/*` → Savings Service
- `/api/v1/loans/*` → Loan Service
- `/api/v1/accounting/*` → Accounting Service
- `/api/v1/reports/*` → Reports Service
- `/api/v1/health` → Service health checks

**Technology:**
- NestJS with `@nestjs/common` and `@nestjs/microservices`
- JWT validation middleware
- Request logging and correlation IDs

---

### 4.2 Authentication & Authorization Service
**Responsibility:** User identity verification, session management, and permission enforcement

**Key Features:**
- Multi-factor authentication (Phase 1: password + SMS OTP)
- JWT token generation and validation
- Session lifecycle management
- Organization and role-based access control (RBAC)
- Password policy enforcement with security standards
- User audit trail for security compliance

**Entities:**
- `User` - Application users (members, staff, admins)
- `Role` - Access control definitions (admin, manager, member, accountant)
- `Session` - Active user sessions with expiration
- `PermissionMatrix` - Role-to-action mappings

**External Integrations:**
- SMS gateway for OTP delivery (Phase 2)
- Email service for password reset notifications

**Technology:**
- NestJS with `@nestjs/passport` and `@nestjs/jwt`
- TypeORM repositories for user and session management
- Redis for session storage and token blacklisting
- bcrypt for password hashing

---

### 4.3 Member Service
**Responsibility:** Member lifecycle management, KYC compliance, and profile maintenance

**Key Features:**
- Member registration with KYC data collection
- Member profile management (basic info, contact, addresses)
- Member categories (individual, joint, group)
- Member status tracking (active, inactive, suspended, closed)
- Nomination and beneficiary management
- Member verification and approval workflow
- Document management (ID scans, proof of address, etc.)

**Entities:**
- `Member` - Core member information
- `MemberContact` - Phone, email, address details
- `MemberDocument` - KYC documents and verification status
- `MemberNomination` - Nominated beneficiaries
- `MemberGroup` - Group membership tracking (Phase 2)

**Business Rules:**
- Unique member ID generation (cooperative-scoped)
- Mandatory KYC fields for registration
- Email and phone verification requirements
- Member de-duplication checks

**Technology:**
- NestJS with RESTful endpoints
- TypeORM with proper indexing on member IDs and emails
- Event publishing for member lifecycle events

---

### 4.4 Savings Service
**Responsibility:** Savings account management, deposits, withdrawals, and interest calculations

**Key Features:**
- Multiple savings account types (regular, special, target savings)
- Account opening and closure workflows
- Deposit and withdrawal transactions with validation
- Interest calculation and capitalization (monthly/quarterly)
- Minimum balance enforcement
- Account reconciliation and statement generation
- Savings goal tracking (Phase 2)

**Entities:**
- `SavingsAccount` - Account master
- `SavingsTransaction` - Deposit and withdrawal records
- `SavingsInterest` - Interest accrual records
- `SavingsAccountType` - Configuration for account types
- `InterestPolicy` - Interest rate and calculation rules

**Business Rules:**
- Positive balance enforcement
- Transaction limits per day/month (configurable)
- Interest calculation using daily balance or cycle-based method
- Minimum account balance requirements
- Withdrawal penalty configurations

**Technology:**
- NestJS microservice with domain-driven design
- TypeORM with transaction management for ACID compliance
- Temporal data for audit trails
- Scheduled batch jobs for interest calculation

---

### 4.5 Loan Service
**Responsibility:** Loan product management, application processing, disbursement, and repayment tracking

**Key Features:**
- Multiple loan products (personal, group, emergency, seasonal)
- Loan application and approval workflow with collateral management
- Loan disbursement in single/multiple tranches
- Repayment schedule generation (monthly, bi-weekly, weekly installments)
- Payment processing and arrears tracking
- Loan write-off and restructuring (Phase 2)
- Loan officer assignment and portfolio tracking

**Entities:**
- `LoanProduct` - Product configurations and terms
- `LoanApplication` - Application and approval workflow
- `LoanAccount` - Active loan records
- `LoanSchedule` - Repayment schedules
- `LoanTransaction` - Disbursement and repayment records
- `LoanCollateral` - Security deposit information
- `LoanArrears` - Overdue tracking

**Business Rules:**
- Loan-to-value (LTV) ratio enforcement
- Member eligibility checks (savings history, repayment track record)
- Loan amount calculation based on savings ratio and collateral
- Compound interest calculation with penalty for late payments
- Automatic schedule generation based on product terms
- Arrears tracking and follow-up alerts

**Technology:**
- NestJS microservice with complex domain logic
- TypeORM with triggers for automatic arrears calculation
- Event-driven workflow for application state transitions
- Scheduled jobs for interest accrual and arrears updates

---

### 4.6 Accounting Service
**Responsibility:** General ledger management, financial reporting, and compliance accounting

**Key Features:**
- Chart of accounts aligned with cooperative accounting standards
- Double-entry bookkeeping enforcement
- Transaction posting and reconciliation
- General ledger and trial balance generation
- Financial statement preparation (P&L, Balance Sheet)
- MRA MFI-DBMS compliance reporting
- Journal entry management for manual adjustments
- Bank reconciliation workflows

**Entities:**
- `GLAccount` - Chart of accounts master
- `JournalEntry` - Individual transaction records
- `GLPosting` - Double-entry bookkeeping records
- `GLBatch` - Batch transaction processing
- `Reconciliation` - Bank and GL reconciliation records
- `FinancialStatementTemplate` - Reporting templates

**Business Rules:**
- All transactions must have debit = credit
- GL account hierarchy for consolidated reporting
- Restricted GL operations (no direct debits to specific accounts)
- Monthly/quarterly closing procedures
- Compliance field mappings for MRA reporting

**Integrations:**
- Consumes events from Savings, Loan, and other services
- Publishes settled transaction events

**Technology:**
- NestJS with complex financial logic
- TypeORM with strong data integrity constraints
- Event-driven architecture for transaction capture
- Background batch jobs for reconciliation

---

### 4.7 Notification Service
**Responsibility:** Multi-channel notifications and communication management

**Key Features:**
- SMS notifications for transactions, OTP, and alerts
- Email notifications with HTML templates
- In-app push notifications
- Notification preferences and opt-out management
- Notification retry and delivery tracking
- Notification templates with Bangla localization
- Bulk notification scheduling

**Channels:**
- SMS (Phase 1: SMS gateway integration)
- Email (SMTP-based)
- In-App (Phase 2: web socket based real-time notifications)
- Mobile Push (Phase 2: FCM integration)

**Technology:**
- NestJS with queue-based processing via RabbitMQ
- Handlebars or similar for template rendering
- Retry mechanisms with exponential backoff
- Delivery tracking and logging

---

### 4.8 Reports Service
**Responsibility:** Financial reporting, analytics, and regulatory compliance reporting

**Key Features:**
- Standard reports (member register, savings summary, loan portfolio)
- Financial reports (P&L, Balance Sheet, Cash Flow)
- MRA compliance reports (MFI-DBMS format outputs)
- Portfolio analysis (aging, NPL, concentration)
- Member analytics (acquisition, retention, lifetime value)
- Ad-hoc report builder (Phase 2)
- Scheduled report generation and distribution
- Export in multiple formats (PDF, Excel, CSV)

**Report Types:**
- **Daily:** Transaction summary, exception reports
- **Monthly:** Financial statements, regulatory reporting
- **Quarterly:** Portfolio analysis, member metrics
- **Annual:** Audit reports, compliance certification

**Technology:**
- NestJS microservice
- Query service pattern for complex aggregations
- Report generation: PDF (PDFKit), Excel (XLSX)
- Async report generation with background queues
- Caching for frequently accessed reports

---

### 4.9 Audit Log Service
**Responsibility:** Comprehensive audit trail for compliance and security

**Key Features:**
- Immutable audit log for all critical operations
- User action tracking (who, what, when, where)
- Change history and versioning
- Sensitive data masking in logs
- Audit log retention and archival
- Compliance reporting on audit events

**Tracked Events:**
- User login/logout and failed attempts
- Member creation, modification, document uploads
- Financial transactions (deposits, withdrawals, loans, payments)
- GL modifications and reconciliations
- Loan application status changes
- User role and permission changes
- System configuration changes

**Technology:**
- NestJS event listeners
- Append-only database for immutability
- Structured logging with correlation IDs
- Compression and archival for historical data

---

## 5. Communication Strategy

### 5.1 Synchronous Communication (REST)

Used for:
- Client requests through API Gateway
- Simple service-to-service queries
- Real-time data lookups

Example: Gateway → Member Service for member validation

**Protocol:** HTTP/REST with JSON
**Timeout:** 5-10 seconds per request
**Retry:** Client-side with exponential backoff

---

### 5.2 Asynchronous Communication (Event-Driven via RabbitMQ)

Used for:
- Post-transaction notifications
- Cross-service state synchronization
- Non-blocking workflows
- Audit logging

**Message Broker:** RabbitMQ
**Pattern:** Publish-Subscribe with Topic Exchange

Example Event Flow:
1. Savings Service publishes `SavingsTransaction.Created` event
2. Accounting Service subscribes and creates GL postings
3. Notification Service subscribes and sends SMS/email
4. Audit Log Service subscribes and records the event
5. Reports Service subscribes for aggregation

**Guaranteed Delivery:** Durable queues with acknowledgment
**Dead Letter Handling:** Dead-letter queue for failed messages
**Idempotency:** Service-level idempotency keys for safe retries

---

### 5.3 API Contract & Versioning

- **Versioning Strategy:** URL-based versioning (v1, v2)
- **Backwards Compatibility:** Minor version increments maintain compatibility
- **Breaking Changes:** Major version increments (v1 → v2)
- **Deprecation:** 6-month notice period for deprecation

---

## 6. Data Flow Diagrams

### 6.1 Member Registration Flow

```
┌─────────┐
│  React  │
│   SPA   │
└────┬────┘
     │ POST /api/v1/members/register
     │
┌────▼──────────────┐
│  API Gateway      │
│  (Authentication) │
└────┬──────────────┘
     │
     │ POST /members
┌────▼────────────────────────────┐
│  Member Service                 │
│  - Validate KYC data            │
│  - Check member de-duplication  │
│  - Generate member ID           │
└────┬───────────────────────────┬┘
     │                           │
     │ Save via                  │ Event:
     │ TypeORM                   │ MemberCreated
     │                           │
┌────▼───────────────┐  ┌────────▼──────────┐
│  MySQL 8           │  │    RabbitMQ       │
│  (members table)   │  │  (event queue)    │
└────────────────────┘  └────┬───────┬──────┘
                              │       │
                         ┌────▼─┐ ┌──▼──────────────┐
                         │Auth  │ │Notification Svc │
                         │Svc   │ │(Send welcome    │
                         └──────┘ │ SMS/Email)      │
                                   └─────────────────┘
```

### 6.2 Loan Disbursement Flow

```
┌──────────────┐
│ Loan Officer │
│  (Web SPA)   │
└──────┬───────┘
       │ POST /api/v1/loans/123/disburse
       │
┌──────▼──────────────────────────┐
│  API Gateway                     │
│  (Authentication & Authorization)│
└──────┬──────────────────────────┘
       │
       │ POST /loans/123/disburse
┌──────▼────────────────────────────┐
│  Loan Service                      │
│  - Verify loan status              │
│  - Check member account            │
│  - Process disbursement            │
│  - Generate transactions           │
└──────┬──────────────┬──────────────┘
       │              │
    Event:         REST Call
    Loan.Disbursed /accounts/123
       │
│┌─────▼─────────────────┐
││  RabbitMQ              │
│└─────┬──────────┬───────┘
       │          │
  ┌────▼────┐ ┌──▼──────────────┐
  │Accounting│ │Notification Svc │
  │Service   │ │(Send SMS to     │
  │- Create  │ │ member)         │
  │GL posting│ └─────────────────┘
  │- Update  │
  │Balance   │
  └──────────┘
```

### 6.3 Interest Accrual Batch Process

```
┌─────────────────────────┐
│  Scheduler (Daily 6 AM) │
└────────┬────────────────┘
         │
         │ Trigger
┌────────▼────────────────────────────┐
│  Savings Service                     │
│  (calculateDailyInterest Job)        │
│  - Query all active accounts         │
│  - Calculate interest per account    │
│  - Generate interest transactions    │
└────────┬─────────────────────────┬───┘
         │                         │
      Event:                       │
   SavingsInterest.Accrued        │
         │                         │
    ┌────▼──────────┐      ┌──────▼──────────┐
    │  RabbitMQ     │      │  MySQL 8        │
    │ (fan out)     │      │  (insert into   │
    └────┬──────┬───┘      │   interest_txns)│
         │      │          └─────────────────┘
    ┌────▼┐ ┌───▼─────────────────┐
    │Acct │ │Accounting Service   │
    │Svc  │ │- Post GL entries    │
    │-Post│ │  (Interest expense, │
    │GL   │ │   Savings income)   │
    │     │ │- Update GL balances │
    └─────┘ └─────────────────────┘
```

---

## 7. Database Schema Overview

### Core Entities & Relationships

```
USERS
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password_hash
├── organization_id (FK)
├── status (active, inactive, locked)
├── created_at, updated_at

MEMBERS
├── id (PK)
├── member_id (UNIQUE, scoped per org)
├── organization_id (FK)
├── first_name_bn (Bangla)
├── last_name_bn (Bangla)
├── date_of_birth
├── gender
├── nid (National ID)
├── phone (UNIQUE)
├── email
├── address
├── kyc_status (pending, verified, rejected)
├── member_status (active, inactive, suspended, closed)
├── created_at, updated_at

SAVINGS_ACCOUNTS
├── id (PK)
├── account_number (UNIQUE, scoped per org)
├── member_id (FK)
├── account_type_id (FK)
├── current_balance
├── opening_date
├── closing_date (nullable)
├── status (active, inactive, closed)
├── created_at, updated_at

SAVINGS_TRANSACTIONS
├── id (PK)
├── savings_account_id (FK)
├── transaction_type (deposit, withdrawal, interest, penalty, fee)
├── amount (decimal 12,2)
├── transaction_date
├── posting_date
├── reference_id
├── created_at

LOAN_ACCOUNTS
├── id (PK)
├── loan_id (UNIQUE, scoped per org)
├── member_id (FK)
├── loan_product_id (FK)
├── principal_amount
├── interest_rate
├── tenure_months
├── disbursement_date (nullable)
├── maturity_date (nullable)
├── status (application, approved, active, closed, defaulted)
├── created_at, updated_at

LOAN_SCHEDULES
├── id (PK)
├── loan_account_id (FK)
├── installment_number
├── installment_amount
├── principal_portion
├── interest_portion
├── due_date
├── payment_date (nullable)
├── status (pending, paid, arrear, waived)
├── created_at

GL_ACCOUNTS
├── id (PK)
├── account_number (UNIQUE)
├── account_name_en
├── account_name_bn
├── account_type (Asset, Liability, Equity, Revenue, Expense)
├── balance_type (Debit, Credit)
├── organization_id (FK)
├── parent_account_id (nullable, for hierarchy)
├── status (active, inactive)
├── created_at

JOURNAL_ENTRIES
├── id (PK)
├── reference_type (savings, loan, manual, adjustment)
├── reference_id (UUID)
├── entry_date
├── posting_date
├── created_by_user_id (FK)
├── created_at

GL_POSTINGS
├── id (PK)
├── journal_entry_id (FK)
├── gl_account_id (FK)
├── debit_amount (decimal 12,2, 0 if credit)
├── credit_amount (decimal 12,2, 0 if debit)
├── created_at

AUDIT_LOGS
├── id (PK)
├── event_type (user_action, data_change, etc.)
├── entity_type (member, savings_account, loan, etc.)
├── entity_id
├── user_id (FK, nullable for system events)
├── action (CREATE, UPDATE, DELETE, VIEW)
├── changes (JSON with before/after values)
├── ip_address
├── timestamp
```

---

## 8. Phase 1 Requirements Mapping

| Requirement | Component(s) | Implementation Status |
|-------------|--------------|----------------------|
| Member Registration | Member Service | Core feature |
| KYC Compliance | Member Service, Compliance Service | Core feature with MRA alignment |
| Savings Account Opening | Member + Savings Service | Core feature |
| Deposits/Withdrawals | Savings Service | Core feature |
| Interest Calculation | Savings Service + Accounting | Core feature |
| Loan Application | Loan Service | Core feature |
| Loan Approval Workflow | Loan Service + Auth (RBAC) | Core feature |
| Loan Disbursement | Loan Service + Accounting | Core feature |
| Repayment Processing | Loan Service + Accounting | Core feature |
| General Ledger | Accounting Service | Core feature |
| Financial Reporting | Reports Service + Accounting | Core feature (P&L, Balance Sheet) |
| MRA MFI-DBMS Reporting | Accounting + Reports Service | Core feature with mappings |
| Audit Trail | Audit Log Service | Core feature - immutable logging |
| User Authentication | Auth Service | Core feature (JWT + password) |
| User Authorization | Auth Service + Gateway | Core feature (RBAC) |
| Notifications (SMS/Email) | Notification Service | Core feature with partner integration |
| Multi-Tenancy (Org Scoping) | All Services | Core feature (org_id in all entities) |
| Data Localization (Bangla) | UI + Database | Core feature (Bangla fields in Member, GL) |

---

## 9. MRA MFI-DBMS Compliance Mapping

### Compliance Framework
The platform aligns with MRA's Member-wise Fund Disbursement-wise Bilking System (MFI-DBMS) requirements:

**Required Data Points:**
- Member-wise savings account details and balances
- Loan-wise disbursement details and schedules
- Interest income and expense tracking
- Asset quality metrics (NPL ratio, arrears analysis)
- Capital adequacy information
- Operational efficiency metrics

**Implementation Approach:**
1. **Data Capture:** All member and transaction data captured at point of origination
2. **GL Mapping:** Standardized GL account codes aligned with MRA reporting templates
3. **Batch Exports:** Scheduled batch jobs to generate MFI-DBMS compliant reports
4. **Audit Trail:** Immutable audit logging for regulatory inspection

**Compliance Reports (Phase 1):**
- Member Register (with KYC status)
- Savings Account Summary
- Loan Portfolio Report
- Financial Statements (P&L, Balance Sheet)
- Trial Balance for GL audit

**Scheduled Batch Reporting:**
- Daily: Transaction summary
- Monthly: Financial statements, regulatory reporting, P&L analysis
- Quarterly: Portfolio analysis, NPL metrics
- Annual: Audit-ready compliance pack

---

## 10. Deployment Topology

### Phase 1 Deployment: Docker Compose (Single Node)

```
┌─────────────────────────────────────────────────────────────────┐
│                       Docker Host (VM/Server)                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Docker Network: sacco-network               │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────────┐   │  │
│  │  │  Nginx Reverse Proxy (Port 80, 443)           │   │  │
│  │  │  - SSL/TLS termination                        │   │  │
│  │  │  - Load balancing (if multiple replicas)      │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  │              │                                         │  │
│  │  ┌───────────┼───────────────────────────────────┐   │  │
│  │  │ Services (Node.js containers)                │   │  │
│  │  │                                               │   │  │
│  │  │ ├─ API Gateway Service                       │   │  │
│  │  │ ├─ Auth Service                              │   │  │
│  │  │ ├─ Member Service                            │   │  │
│  │  │ ├─ Savings Service                           │   │  │
│  │  │ ├─ Loan Service                              │   │  │
│  │  │ ├─ Accounting Service                        │   │  │
│  │  │ ├─ Notification Service                      │   │  │
│  │  │ ├─ Reports Service                           │   │  │
│  │  │ └─ Audit Log Service                         │   │  │
│  │  └───────────┬───────────────────────────────────┘   │  │
│  │              │                                         │  │
│  │  ┌───────────┼────────────────┬────────────────────┐ │  │
│  │  │           │                │                    │ │  │
│  │  │  ┌────────▼────────┐  ┌───▼──────────────┐   │ │  │
│  │  │  │  MySQL 8        │  │  RabbitMQ        │   │ │  │
│  │  │  │  (Port 3306)    │  │  (Port 5672)     │   │ │  │
│  │  │  │  - All services │  │  - Event bus     │   │ │  │
│  │  │  │    connect here │  │  - Message queue │   │ │  │
│  │  │  └─────────────────┘  └──────────────────┘   │ │  │
│  │  │                                               │ │  │
│  │  │  ┌────────────────────────────────────────┐   │ │  │
│  │  │  │  Redis                                 │   │ │  │
│  │  │  │  (Port 6379)                           │   │ │  │
│  │  │  │  - Session storage                    │   │ │  │
│  │  │  │  - Cache                              │   │ │  │
│  │  │  └────────────────────────────────────────┘   │ │  │
│  │  └───────────────────────────────────────────────┘ │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Volumes (Persistent Storage)                       │  │
│  │   ├─ mysql_data: /var/lib/mysql                      │  │
│  │   ├─ rabbitmq_data: /var/lib/rabbitmq                │  │
│  │   ├─ redis_data: /var/lib/redis                      │  │
│  │   └─ logs: /var/log/sacco                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 1 Deployment Configuration

**Docker Compose File:** `docker-compose.yml`

**Service Specifications:**
- **API Gateway:** 2 replicas (load balanced via Nginx)
- **Core Services:** 1 instance each (can scale post-Phase 1)
- **Notification Service:** 1 worker + 1 consumer queue
- **MySQL:** Single instance with automated backups
- **RabbitMQ:** Single node cluster (HA in Phase 2)
- **Redis:** Single instance with persistence

**Environment Configuration:**
- Environment variables in `.env` files per environment (dev, staging, prod)
- Database migrations handled via TypeORM CLI
- Service discovery via Docker DNS

---

### Phase 1 Deployment Process

1. **Repository Setup:**
   ```bash
   git clone <repo>
   cd cooperative-sacco
   pnpm install  # Install all workspace dependencies
   ```

2. **Configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with database, API keys, organization ID
   ```

3. **Database Initialization:**
   ```bash
   docker-compose up -d mysql redis rabbitmq
   pnpm run migrate  # Run TypeORM migrations
   pnpm run seed    # Seed initial data (GL accounts, account types, loan products)
   ```

4. **Service Startup:**
   ```bash
   docker-compose up -d  # Start all services
   ```

5. **Verification:**
   ```bash
   curl http://localhost/api/v1/health  # Check system health
   ```

---

## 11. Development Workflow

### Project Structure (pnpm Workspaces)

```
cooperative-sacco/
├── packages/
│   ├── shared/                 # Shared utilities and types
│   │   ├── src/
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   ├── utils/          # Common functions
│   │   │   ├── decorators/     # Custom NestJS decorators
│   │   │   └── middleware/     # Common middleware
│   │   └── package.json
│   │
│   ├── api-gateway/            # API Gateway Service
│   │   ├── src/
│   │   │   ├── gateway/
│   │   │   ├── middleware/
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   ├── auth-service/           # Authentication Service
│   │   ├── src/
│   │   │   ├── modules/        # NestJS modules
│   │   │   ├── entities/       # TypeORM entities
│   │   │   ├── services/
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   ├── member-service/         # Member Management Service
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   ├── entities/
│   │   │   ├── services/
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   ├── savings-service/        # Savings Management Service
│   │   └── ... (similar structure)
│   │
│   ├── loan-service/           # Loan Management Service
│   │   └── ... (similar structure)
│   │
│   ├── accounting-service/     # Accounting & GL Service
│   │   └── ... (similar structure)
│   │
│   ├── notification-service/   # Notification Service
│   │   └── ... (similar structure)
│   │
│   ├── reports-service/        # Reports & Analytics
│   │   └── ... (similar structure)
│   │
│   ├── audit-service/          # Audit Logging
│   │   └── ... (similar structure)
│   │
│   └── web-app/                # React SPA
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── store/
│       │   ├── localization/   # Bangla translations
│       │   └── App.tsx
│       └── package.json
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── tsconfig.json (root)
├── .eslintrc.json
├── .prettierrc
├── Dockerfile.multi-stage
├── docs/
│   ├── phase1/
│   │   ├── architecture-blueprint.md (this file)
│   │   ├── api-specification.md
│   │   ├── database-schema.md
│   │   └── deployment-guide.md
│   └── ... (additional documentation)
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline
│       └── deploy.yml          # Deployment pipeline
└── README.md
```

---

## 12. Security Considerations

### Authentication & Authorization
- **JWT Token:** Signed with RS256 algorithm, 1-hour expiration
- **Refresh Token:** 30-day rolling expiration with secure storage
- **Multi-Factor:** SMS OTP for high-risk operations (Phase 1)
- **RBAC:** Fine-grained role-based access control at API level

### Data Security
- **Encryption:** TLS 1.3 for all data in transit
- **Password:** Bcrypt with 12 salt rounds
- **Sensitive Fields:** Encryption at rest for NID, PAN, and account numbers
- **API Keys:** Stored as hashed values in Redis with expiration

### Infrastructure Security
- **Network:** Docker network isolation, firewall rules
- **Database:** MySQL with user roles, limited query permissions
- **Logging:** Audit logs immutable, no sensitive data stored

### Compliance
- **Data Retention:** 7-year retention policy for audit logs (regulatory requirement)
- **Access Logs:** Comprehensive logging with user tracking
- **Exception Handling:** Secure error messages (no stack traces in production)

---

## 13. Monitoring & Observability

### Logging Strategy
- **Application Logs:** Structured JSON logs via Winston/Pino
- **Correlation IDs:** Trace requests across services
- **Log Retention:** 30 days in application tier, archival to S3 (Phase 2)

### Key Metrics (Phase 2)
- Request latency (p50, p95, p99)
- Error rates and types
- Service availability
- Database query performance
- Message queue depth and processing time

### Health Checks
- **Service Health:** `/health` endpoint (database, cache, message broker connectivity)
- **Graceful Shutdown:** Drain in-flight requests before termination
- **Startup Readiness:** `/ready` endpoint for orchestration systems

---

## 14. Testing Strategy

### Unit Testing (Phase 1)
- Business logic in services
- Validators and decorators
- Utility functions
- Framework: Jest with good coverage (>80%)

### Integration Testing (Phase 1)
- Database operations with real MySQL container
- Service-to-service REST calls
- Event publishing and subscription
- Framework: Jest with `@nestjs/testing`

### End-to-End Testing (Phase 2)
- Complete workflows via API Gateway
- Multi-service scenarios
- Framework: Cypress or Playwright

### Load Testing (Phase 2)
- Peak load scenario: 1000 concurrent users
- Tool: k6 or Apache JMeter
- Target: Sub-second response times for core operations

---

## 15. Performance Targets

### Response Times (SLA)
- Member lookup: <100ms
- Account balance check: <100ms
- Transaction submission: <500ms
- Report generation (daily): <5 minutes

### Throughput
- Peak concurrent users: 1000 (scalable to 10,000 in Phase 2)
- Daily transactions: 100,000 (scalable)
- Member accounts: 100,000 (scalable to 1M)

### Availability
- Target uptime: 99% (Phase 1), 99.9% (Phase 2+)
- Planned maintenance: 1 hour per month
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes

---

## 16. Future Phases (Out of Scope for Phase 1)

### Phase 2: Mobile & Real-Time Enhancements
- Mobile app (iOS/Android) with offline capabilities
- Real-time notifications via WebSocket
- Kubernetes deployment for horizontal scaling
- Advanced analytics and predictive features
- Integration with national payment systems

### Phase 3: AI/ML & Ecosystem
- Loan affordability prediction
- Fraud detection models
- Dashboard customization
- Third-party integrations (accounting software, government reporting)
- International expansion with multi-currency support

---

## 17. Documentation Index

### Architecture Documentation
- `docs/phase1/architecture-blueprint.md` (this file)
- `docs/phase1/api-specification.md` - Complete REST API endpoints
- `docs/phase1/database-schema.md` - Detailed entity relationships
- `docs/phase1/data-flow-diagrams.md` - Visual workflow documentation

### Setup & Deployment
- `docs/phase1/deployment-guide.md` - Docker Compose setup instructions
- `docs/phase1/configuration-guide.md` - Environment and service configuration
- `docs/phase1/database-migration-guide.md` - Running migrations and seeds

### Development
- `docs/phase1/development-setup.md` - Local development environment
- `docs/phase1/coding-standards.md` - TypeScript, NestJS, and React guidelines
- `docs/phase1/service-development-guide.md` - Creating new microservices

### Operations
- `docs/phase1/monitoring-guide.md` - Logging and observability setup
- `docs/phase1/troubleshooting-guide.md` - Common issues and solutions
- `docs/phase1/backup-recovery-guide.md` - Data backup and disaster recovery

### Compliance
- `docs/phase1/mra-compliance-mapping.md` - Detailed MRA MFI-DBMS mappings
- `docs/phase1/audit-log-specification.md` - Audit logging requirements
- `docs/phase1/security-guidelines.md` - Security best practices

---

## 18. Acceptance Criteria Checklist

- [x] Architecture vision and constraints documented
- [x] Technology stack choices justified and detailed
- [x] Service boundaries clearly defined with responsibilities
- [x] Communication patterns (sync/async) specified
- [x] Data flow diagrams for critical workflows
- [x] Database schema overview provided
- [x] Phase 1 requirements mapped to components
- [x] MRA compliance considerations documented
- [x] Deployment topology (Docker Compose) defined
- [x] Development workflow and project structure outlined
- [x] Security considerations documented
- [x] Monitoring and observability strategy included
- [x] Performance targets defined
- [x] Future phases identified as out-of-scope
- [x] Linked from root README
- [x] Complete, reviewable documentation

---

## Appendix A: Glossary

- **SACCO:** Savings and Credit Cooperative Organization
- **MRA:** Microcredit Regulatory Authority (Bangladesh)
- **MFI-DBMS:** Member-wise Fund Disbursement-wise Bilking System
- **KYC:** Know Your Customer (regulatory requirement)
- **AML:** Anti-Money Laundering
- **NPL:** Non-Performing Loan
- **GL:** General Ledger
- **P&L:** Profit and Loss statement
- **ORM:** Object-Relational Mapping (TypeORM)
- **RTO:** Recovery Time Objective
- **RPO:** Recovery Point Objective
- **LTV:** Loan-to-Value ratio

---

## Appendix B: References & Standards

- NestJS Official Documentation: https://docs.nestjs.com
- TypeORM Documentation: https://typeorm.io
- OpenAPI/Swagger Specification: https://swagger.io
- MRA Microfinance Guidelines: https://mra.gov.bd
- ISO 20022 Financial Data Standards: https://www.iso20022.org
- Cooperative Society Act, Bangladesh 2001

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Review
