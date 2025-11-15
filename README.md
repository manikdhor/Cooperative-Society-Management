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

---

## 🚀 Deployment Guide

### Pre-Deployment Checklist

Before deploying, run the comprehensive pre-deployment check:

```bash
# Run all pre-deployment validations
./scripts/pre-deploy-check.sh
```

This script will:
- ✅ Verify all dependencies are installed
- ✅ Run all unit and integration tests
- ✅ Build all packages
- ✅ Validate Docker configuration
- ✅ Check environment setup

### Database Setup

#### Option 1: PostgreSQL (Recommended for Production)
```bash
# Add PostgreSQL to your services
npm install pg @types/pg

# Environment variables for .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cooperative_society
DB_USER=postgres
DB_PASSWORD=your_secure_password
```

#### Option 2: MongoDB
```bash
# Add MongoDB to your services
npm install mongodb @types/mongodb

# Environment variables for .env
DB_HOST=localhost
DB_PORT=27017
DB_NAME=cooperative_society
DB_USER=mongodb
DB_PASSWORD=your_secure_password
```

#### Option 3: SQLite (Development/Small Deployments)
```bash
# Add SQLite to your services
npm install sqlite3 @types/sqlite3

# Environment variable for .env
DB_PATH=./data/cooperative_society.db
```

### Deployment Options

#### 1. Docker Compose (Recommended for Self-Hosting)
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Deploy with production configuration
./scripts/deploy.sh
# Or manually:
docker-compose -f docker-compose.prod.yml up -d

# Check health
./scripts/health-check.sh
```

**Services:**
- API Gateway: http://localhost:3000
- Member Service: http://localhost:3001  
- Loan Service: http://localhost:3002
- Web App: http://localhost

#### 2. Railway (Cloud Platform)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
./scripts/deploy.sh
# Choose option 2 for Railway deployment
```

#### 3. DigitalOcean App Platform
```bash
# Install doctl
curl -sL https://github.com/digitalocean/doctl/releases/latest/download/doctl-linux-amd64.tar.gz | tar xz
sudo mv doctl /usr/local/bin

# Deploy
./scripts/deploy.sh
# Choose option 3 for DigitalOcean
```

#### 4. Vercel + Railway (Hybrid)
```bash
# Deploy frontend to Vercel
cd apps/web
vercel --prod

# Deploy backend services to Railway
./scripts/deploy.sh
# Choose option 2 for Railway services
```

#### 5. AWS Full Stack
```bash
# Install AWS CLI
curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'
unzip awscliv2.zip
sudo ./aws/install

# Deploy to ECS
./scripts/deploy.sh
# Choose option 4 for AWS ECS
```

### Environment Configuration

Create your `.env` file from the example:

```bash
cp .env.example .env
```

**Required variables for production:**
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (generate a secure random string)
- `NODE_ENV=production`

**Optional variables:**
- `REDIS_HOST`, `REDIS_PORT` (for caching)
- `SMTP_*` (for email notifications)
- `SENTRY_DSN` (for error tracking)

### Health Monitoring

After deployment, monitor your services:

```bash
# Comprehensive health check
./scripts/health-check.sh

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f

# Individual service logs
docker-compose -f docker-compose.prod.yml logs -f api-gateway
```

### SSL/HTTPS Setup

#### Option 1: Nginx Reverse Proxy
```bash
# Add to docker-compose.prod.yml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - ./ssl:/etc/nginx/ssl:ro
```

#### Option 2: Cloudflare (Recommended)
1. Point your domain to Cloudflare
2. Enable SSL/TLS encryption
3. Configure proxy rules for your services

### Scaling Considerations

#### Horizontal Scaling
```yaml
# docker-compose.prod.yml
services:
  api-gateway:
    deploy:
      replicas: 3
  member-service:
    deploy:
      replicas: 2
  loan-service:
    deploy:
      replicas: 2
```

#### Load Balancing
- Use Nginx or cloud load balancers
- Configure health checks
- Set up auto-scaling policies

### Backup Strategy

#### Database Backups
```bash
# PostgreSQL backup
docker exec coop-postgres pg_dump -U postgres cooperative_society > backup_$(date +%Y%m%d).sql

# Automated backup script
./scripts/backup-database.sh
```

#### Application Backups
```bash
# Backup Docker volumes
docker run --rm -v cooperative_society_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

### Monitoring & Logging

#### Application Monitoring
```bash
# Add monitoring (example with PM2)
npm install -g pm2

# PM2 ecosystem file for production
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    { name: 'api-gateway', script: 'dist/index.js', cwd: 'apps/api-gateway' },
    { name: 'member-service', script: 'dist/index.js', cwd: 'apps/member-service' },
    { name: 'loan-service', script: 'dist/index.js', cwd: 'apps/loan-service' }
  ]
};
EOF
```

#### Log Management
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/cooperative-society

# View logs
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Security Checklist

- [ ] Change default passwords
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring alerts
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Access control policies

### Troubleshooting

#### Common Issues

**Services not starting:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check ports
netstat -tulpn | grep :3000
```

**Database connection issues:**
```bash
# Test database connection
docker exec -it coop-postgres psql -U postgres -d cooperative_society

# Check environment variables
docker exec coop-api-gateway env | grep DB_
```

**Performance issues:**
```bash
# Monitor resource usage
docker stats

# Check disk space
df -h
```

### Support

For deployment issues:
1. Check the health check script output
2. Review service logs
3. Verify environment variables
4. Check network connectivity
5. Review this documentation

## License

MIT
