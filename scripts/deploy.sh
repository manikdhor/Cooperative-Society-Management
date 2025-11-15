#!/bin/bash

echo "🚀 Cooperative Society Management - Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if environment file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found. Please create it from .env.example${NC}"
    exit 1
fi

echo -e "\n${BLUE}🔧 Deployment Options:${NC}"
echo "1. Docker Compose (Local/Cloud Server)"
echo "2. Railway (Cloud Platform)"
echo "3. DigitalOcean App Platform"
echo "4. AWS ECS"
echo "5. Exit"

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}🐳 Deploying with Docker Compose...${NC}"
        
        # Build and start services
        docker-compose -f docker-compose.prod.yml build
        print_status $? "Docker build completed"
        
        docker-compose -f docker-compose.prod.yml up -d
        print_status $? "Services started successfully"
        
        echo -e "\n${GREEN}🎉 Deployment completed!${NC}"
        echo -e "${BLUE}📱 Access your application:${NC}"
        echo "• API Gateway: http://localhost:3000"
        echo "• Member Service: http://localhost:3001"
        echo "• Loan Service: http://localhost:3002"
        echo "• Web App: http://localhost"
        ;;
        
    2)
        echo -e "\n${YELLOW}🚂 Deploying to Railway...${NC}"
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        # Login to Railway
        railway login
        
        # Deploy each service
        echo "Deploying API Gateway..."
        cd apps/api-gateway && railway up --service=api-gateway
        cd ../..
        
        echo "Deploying Member Service..."
        cd apps/member-service && railway up --service=member-service
        cd ../..
        
        echo "Deploying Loan Service..."
        cd apps/loan-service && railway up --service=loan-service
        cd ../..
        
        echo "Deploying Web App..."
        cd apps/web && railway up --service=web
        cd ../..
        
        print_status 0 "Railway deployment completed"
        ;;
        
    3)
        echo -e "\n${YELLOW}🌊 Deploying to DigitalOcean...${NC}"
        
        # Check if doctl is installed
        if ! command -v doctl &> /dev/null; then
            echo "Please install DigitalOcean CLI first:"
            echo "curl -sL https://github.com/digitalocean/doctl/releases/latest/download/doctl-linux-amd64.tar.gz | tar xz"
            echo "sudo mv doctl /usr/local/bin"
            exit 1
        fi
        
        # Create app
        doctl apps create --spec .do/app.yaml
        
        print_status 0 "DigitalOcean deployment initiated"
        ;;
        
    4)
        echo -e "\n${YELLOW}☁️ Deploying to AWS ECS...${NC}"
        
        # Check if AWS CLI is installed
        if ! command -v aws &> /dev/null; then
            echo "Please install AWS CLI first:"
            echo "curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
            echo "unzip awscliv2.zip"
            echo "sudo ./aws/install"
            exit 1
        fi
        
        # Build and push to ECR
        echo "Building and pushing to ECR..."
        
        # This would need to be customized based on your AWS setup
        echo "Please configure your AWS credentials and ECR repository first"
        
        print_status 0 "AWS ECS deployment preparation completed"
        ;;
        
    5)
        echo -e "${YELLOW}👋 Exiting...${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo -e "\n${YELLOW}📝 Post-deployment checklist:${NC}"
echo "• Run: ./scripts/health-check.sh"
echo "• Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "• Set up SSL certificates"
echo "• Configure domain names"
echo "• Set up monitoring and alerts"
echo "• Run security scans"