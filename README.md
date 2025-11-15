# Cooperative Society Management

A comprehensive microservices-based system for managing cooperative societies, including member management, loan processing, and administrative functions.

## Project Structure

This is a monorepo managed with pnpm workspaces:

```
cooperative-society-management/
├── apps/
│   ├── api-gateway/          # Main API gateway (Express + Jest + Supertest)
│   ├── member-service/       # Member management service (Express + Jest + Supertest)
│   ├── loan-service/         # Loan processing service (Express + Jest + Supertest)
│   └── web/                  # Frontend web application (React + Vite + Vitest + Playwright)
├── packages/
│   └── shared/               # Shared utilities and types (Jest)
├── test/
│   └── fixtures/             # Test fixtures and seed data factories
└── docker-compose.yml        # Docker configuration for all services
```

## Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher
- Docker and Docker Compose (for e2e tests)

## Installation

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

## Testing

### Running All Tests

```bash
# Run all unit and integration tests across all packages
pnpm test

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Running Tests for Specific Packages

```bash
# Test shared package
pnpm --filter @coop/shared test

# Test API gateway
pnpm --filter @coop/api-gateway test

# Test member service
pnpm --filter @coop/member-service test

# Test loan service
pnpm --filter @coop/loan-service test

# Test web frontend
pnpm --filter @coop/web test
```

### End-to-End Tests

```bash
# Start all services using Docker
pnpm docker:up

# Run e2e tests with Playwright
pnpm test:e2e

# Run e2e tests with UI mode
pnpm --filter @coop/web test:e2e:ui

# Run e2e tests in debug mode
pnpm --filter @coop/web test:e2e:debug

# Stop all services
pnpm docker:down
```

## Testing Stack

### Backend Services (Jest + ts-jest + Supertest)
- **Jest**: Test framework for unit and integration tests
- **ts-jest**: TypeScript support for Jest
- **Supertest**: HTTP assertions for API testing
- **Coverage thresholds**: 70% minimum for lines, functions, branches, and statements

### Frontend (Vitest + Playwright)
- **Vitest**: Fast unit test framework for Vite projects
- **@testing-library/react**: React component testing utilities
- **Playwright**: End-to-end testing framework
- **Coverage thresholds**: 70% minimum for all metrics

### Test Fixtures
Seed data factories are available in `test/fixtures/`:
- `member.fixtures.ts`: Member data factories
- `loan.fixtures.ts`: Loan data factories

Example usage:
```typescript
import { createMemberFixture, createLoanFixture } from '../../test/fixtures';

const testMember = createMemberFixture({ firstName: 'Jane' });
const testLoan = createLoanFixture({ amount: 5000 });
```

## Development

### Running Services Locally

```bash
# Run API gateway in development mode
pnpm --filter @coop/api-gateway dev

# Run member service in development mode
pnpm --filter @coop/member-service dev

# Run loan service in development mode
pnpm --filter @coop/loan-service dev

# Run web frontend in development mode
pnpm --filter @coop/web dev
```

### Building Services

```bash
# Build all packages
pnpm -r run build

# Build specific package
pnpm --filter @coop/api-gateway build
```

## Docker

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Service Endpoints

- API Gateway: http://localhost:3000
- Member Service: http://localhost:3001
- Loan Service: http://localhost:3002
- Web Frontend: http://localhost:5173

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs all unit and integration tests
- Generates coverage reports
- Builds all packages
- Starts services via Docker Compose
- Runs Playwright e2e tests
- Uploads test artifacts

## Coverage Reports

Coverage reports are generated in the following locations:
- Backend services: `apps/*/coverage/`
- Frontend: `apps/web/coverage/`

View coverage reports by opening the HTML files in a browser:
```bash
# Example: View API gateway coverage
open apps/api-gateway/coverage/index.html
```

## Architecture

### Backend Services
Each microservice is built with:
- Express.js for HTTP server
- TypeScript for type safety
- Jest + ts-jest for testing
- Supertest for integration testing
- Shared utilities from `@coop/shared` package

### Frontend
The web application is built with:
- React 18
- Vite for fast development and building
- Vitest for unit testing
- Playwright for e2e testing
- TypeScript for type safety

## License

MIT
