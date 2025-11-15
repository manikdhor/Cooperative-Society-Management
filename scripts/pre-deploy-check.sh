#!/bin/bash

echo "🚀 Cooperative Society Management - Pre-Deployment Check"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo -e "\n${YELLOW}📋 Running pre-deployment checks...${NC}"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
pnpm install
print_status $? "Dependencies installed"

# Build shared package
echo -e "\n${YELLOW}🔨 Building shared package...${NC}"
pnpm --filter @coop/shared build
print_status $? "Shared package built"

# Run unit tests
echo -e "\n${YELLOW}🧪 Running unit tests...${NC}"
pnpm test:unit
print_status $? "Unit tests passed"

# Run integration tests
echo -e "\n${YELLOW}🔗 Running integration tests...${NC}"
pnpm test:integration
print_status $? "Integration tests passed"

# Build all packages
echo -e "\n${YELLOW}🏗️ Building all packages...${NC}"
pnpm -r run build
print_status $? "All packages built successfully"

# Check Docker
echo -e "\n${YELLOW}🐳 Checking Docker setup...${NC}"
if command -v docker &> /dev/null; then
    docker --version
    print_status 0 "Docker available"
    
    # Test Docker Compose
    if command -v docker-compose &> /dev/null; then
        docker-compose --version
        print_status 0 "Docker Compose available"
        
        echo -e "\n${YELLOW}🔄 Testing Docker build...${NC}"
        docker-compose build
        print_status $? "Docker build successful"
    else
        print_status 1 "Docker Compose not found"
    fi
else
    print_status 1 "Docker not found"
fi

# Check environment variables
echo -e "\n${YELLOW}🔧 Checking environment setup...${NC}"
if [ -f ".env.example" ]; then
    print_status 0 "Environment example file exists"
else
    echo -e "${YELLOW}⚠️  Consider creating .env.example file${NC}"
fi

echo -e "\n${GREEN}🎉 All pre-deployment checks passed!${NC}"
echo -e "\n${YELLOW}📝 Next steps:${NC}"
echo "1. Choose your hosting provider"
echo "2. Set up database"
echo "3. Configure environment variables"
echo "4. Deploy using one of the methods in the deployment guide"
echo -e "\n${YELLOW}🔗 For deployment options, see: README.md#deployment${NC}"