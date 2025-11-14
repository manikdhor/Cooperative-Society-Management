# Cooperative-Society-Management

**Bangla-First SACCO (Savings and Credit Cooperative Organization) Platform**

A modern, scalable microservices-based platform for managing cooperative societies with comprehensive member management, savings accounts, loan services, and financial accounting—designed with cultural and linguistic localization for Bangladesh.

---

## 🎯 Phase 1: Foundation Layer

Phase 1 focuses on building the core infrastructure and critical services for a fully operational SACCO platform:

- **Member Management:** KYC-compliant member registration and profile management
- **Savings Services:** Savings account operations with interest calculations
- **Loan Management:** Loan products, application workflows, and repayment tracking
- **Financial Accounting:** General ledger and financial statement generation
- **Regulatory Compliance:** MRA MFI-DBMS alignment and audit logging
- **User Authentication:** Secure JWT-based authentication with role-based access control
- **Notification System:** Multi-channel notifications (SMS, Email)
- **Reporting:** Financial reports and compliance reporting

### Key Technologies
- **Backend:** NestJS microservices with TypeORM
- **Frontend:** React SPA with Bangla localization
- **Data:** MySQL 8, Redis, RabbitMQ
- **Deployment:** Docker Compose (single-node) with Kubernetes-ready architecture
- **Package Management:** pnpm workspaces for monorepo structure

---

## 📚 Documentation Index

### Architecture & Design
- **[Phase 1 Architecture Blueprint](./docs/phase1/architecture-blueprint.md)** - Complete system design, service boundaries, technology stack, and compliance framework
  - System vision and constraints
  - Microservice architecture overview
  - Service responsibilities and interactions
  - Technology stack justification
  - Data flow diagrams
  - Database schema overview
  - MRA compliance mapping
  - Deployment topology
  - Security and monitoring strategies

### Implementation Guides (Coming Soon)
- **API Specification** - Complete REST API endpoint documentation
- **Database Schema** - Detailed entity relationships and indexes
- **Deployment Guide** - Docker Compose setup and configuration
- **Development Setup** - Local environment configuration and workflow
- **Coding Standards** - TypeScript, NestJS, and React guidelines
- **Service Development Guide** - Creating new microservices in the platform
- **Monitoring & Observability** - Logging, metrics, and alerting setup
- **Compliance & Security** - MRA requirements, audit logging, and security best practices

---

## 🏗️ System Architecture

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
      ┌──────────────┼──────────────┬──────────────┐
      │              │              │              │
  ┌───▼────┐  ┌──────▼──────┐ ┌───▼───┐  ┌──────▼──────┐
  │  Auth  │  │Member Service│ │Savings│  │Loan Service │
  │Service │  │              │ │Service│  │             │
  └────┬───┘  └──────┬───────┘ └───┬───┘  └──────┬──────┘
       │             │             │             │
       └─────────────┼─────────────┼─────────────┘
                     │
              ┌──────▼──────┐
              │  RabbitMQ   │ (Async Event Bus)
              └──────┬──────┘
                     │
      ┌──────────────┼──────────────┬──────────────┐
      │              │              │              │
  ┌───▼────┐  ┌──────▼──────┐ ┌───▼───┐  ┌──────▼──────┐
  │Accounting│  │Notification │ │Reports│  │Audit Log   │
  │Service  │  │Service      │ │Service│  │Service     │
  └─────────┘  └─────────────┘ └───────┘  └────────────┘
       │              │
       └──────────────┼────────────────────┐
                      │                    │
              ┌───────▼───────┐      ┌────▼────────┐
              │    MySQL 8    │      │Redis Cache  │
              └───────────────┘      └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- pnpm package manager

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd cooperative-sacco

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Start infrastructure (MySQL, Redis, RabbitMQ)
docker-compose up -d

# Run database migrations
pnpm run migrate

# Seed initial data (GL accounts, account types, etc.)
pnpm run seed

# Start all services in development mode
pnpm run dev
```

The API Gateway will be available at `http://localhost:3000`

---

## 📋 Service Overview

| Service | Purpose | Key Responsibilities |
|---------|---------|----------------------|
| **API Gateway** | Request orchestration | Routing, authentication, rate limiting |
| **Auth Service** | Identity management | User authentication, JWT tokens, RBAC |
| **Member Service** | Member lifecycle | KYC registration, profile management, verification |
| **Savings Service** | Savings operations | Accounts, deposits, withdrawals, interest |
| **Loan Service** | Loan management | Products, applications, disbursement, repayment |
| **Accounting Service** | Financial records | GL management, journal entries, reconciliation |
| **Notification Service** | Communications | SMS, email, in-app notifications |
| **Reports Service** | Analytics & reporting | Financial statements, compliance reports |
| **Audit Log Service** | Compliance logging | Immutable audit trail for all operations |

---

## 🏦 Supported Use Cases (Phase 1)

### Member Management
- [ ] Member self-registration with Bangla interface
- [ ] KYC document collection and verification
- [ ] Member profile updates and status management
- [ ] Nomination and beneficiary configuration

### Savings Operations
- [ ] Open multiple savings account types
- [ ] Deposit and withdraw funds
- [ ] Automatic interest calculation and posting
- [ ] Monthly statement generation
- [ ] Account closure and reconciliation

### Loan Operations
- [ ] Create multiple loan products with configurable terms
- [ ] Member loan applications with eligibility checking
- [ ] Loan approval workflow with authority levels
- [ ] Single/multiple disbursement support
- [ ] Automated repayment schedule generation
- [ ] Payment collection and arrears tracking

### Financial Management
- [ ] Real-time GL account management
- [ ] Automated journal entry posting
- [ ] Balance sheet and P&L generation
- [ ] Trial balance and reconciliation
- [ ] Monthly financial close processes

### Reporting
- [ ] Member register with status tracking
- [ ] Savings portfolio summary
- [ ] Loan portfolio analysis
- [ ] Financial statements (compliant with cooperative standards)
- [ ] MRA regulatory compliance reports

### Audit & Compliance
- [ ] Complete audit trail of all transactions
- [ ] User activity logging with timestamps
- [ ] Sensitive data access tracking
- [ ] Regulatory compliance documentation
- [ ] Data export for external audits

---

## 🔒 Security Features

- **Authentication:** JWT-based with token refresh
- **Authorization:** Role-based access control (RBAC)
- **Encryption:** TLS 1.3 for all data in transit
- **Data Protection:** Encryption at rest for sensitive fields
- **Audit Logging:** Immutable logs for compliance
- **Input Validation:** Comprehensive validation with Bangla support

---

## 🌐 Localization

The platform is built with Bangla as the first language:
- User interface in Bangla with English fallback
- Database support for Bangla text (UTF-8)
- Bangla date formatting
- Number formatting for Bangladeshi context
- SMS and email templates in Bangla

---

## 📊 Compliance & Standards

### Regulatory
- **MRA MFI-DBMS:** Member-wise fund disbursement reporting
- **KYC/AML:** Know Your Customer and Anti-Money Laundering requirements
- **Audit Trail:** 7-year retention policy
- **Financial Standards:** International cooperative accounting standards

### Technical
- **REST API:** OpenAPI/Swagger compatible
- **Database:** SQL standard compliance with MySQL 8
- **Microservices:** 12-factor app methodology
- **Deployment:** Docker container standards

---

## 🔧 Development

### Project Structure
```
cooperative-sacco/
├── packages/           # pnpm workspace packages
│   ├── shared/        # Shared utilities and types
│   ├── api-gateway/   # API Gateway Service
│   ├── auth-service/  # Authentication Service
│   ├── member-service/
│   ├── savings-service/
│   ├── loan-service/
│   ├── accounting-service/
│   ├── notification-service/
│   ├── reports-service/
│   ├── audit-service/
│   └── web-app/       # React SPA frontend
├── docs/              # Documentation
├── docker-compose.yml
└── README.md
```

### Common Commands
```bash
# Run all services in development
pnpm run dev

# Run specific service
pnpm run -F @sacco/member-service dev

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Build for production
pnpm run build

# Database migrations
pnpm run migrate      # Run pending migrations
pnpm run seed        # Seed initial data
```

---

## 📈 Scalability & Future Phases

### Phase 1 (Current)
- Single-node Docker Compose deployment
- 1,000 concurrent users capacity
- 100,000 daily transactions capacity

### Phase 2 (Planned)
- Kubernetes deployment with auto-scaling
- Mobile app (iOS/Android)
- Real-time notifications via WebSocket
- Advanced analytics and dashboards
- National payment system integration

### Phase 3 (Planned)
- AI/ML for loan affordability prediction
- Fraud detection models
- Multi-currency support
- International expansion
- Third-party API ecosystem

---

## 🤝 Contributing

This project follows cooperative development principles:
- All changes require code review
- Comprehensive documentation required
- Security and compliance reviews mandatory
- User testing for significant features

---

## 📄 License

[License information to be added]

---

## ✉️ Contact & Support

For technical questions, issues, or contributions, please contact the development team.

---

## 📝 Changelog

### Phase 1 (2024)
- Initial architecture blueprint
- Core microservices scaffolding
- Development environment setup
- Documentation framework

---

**Status:** Phase 1 - Architecture Blueprint Complete ✓

For detailed architecture information, see [Phase 1 Architecture Blueprint](./docs/phase1/architecture-blueprint.md)
