#!/bin/bash

echo "🏥 Cooperative Society Management - Health Check"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Services to check
SERVICES=(
    "API Gateway:3000:/health"
    "Member Service:3001:/health"
    "Loan Service:3002:/health"
    "Web App:5173:/"
)

# Function to check service health
check_service() {
    local name=$1
    local port=$2
    local path=$3
    local url="http://localhost:${port}${path}"
    
    echo -e "${BLUE}🔍 Checking $name...${NC}"
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $name is not responding${NC}"
        return 1
    fi
}

# Function to check database connection
check_database() {
    echo -e "\n${BLUE}🗄️ Checking database connection...${NC}"
    
    # Check PostgreSQL
    if docker exec coop-postgres pg_isready -U ${DB_USER:-postgres} -d ${DB_NAME:-cooperative_society} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
    else
        echo -e "${RED}❌ PostgreSQL is not ready${NC}"
    fi
    
    # Check Redis
    if docker exec coop-redis redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis is ready${NC}"
    else
        echo -e "${RED}❌ Redis is not ready${NC}"
    fi
}

# Function to check system resources
check_resources() {
    echo -e "\n${BLUE}📊 System Resources:${NC}"
    
    # Docker containers status
    echo -e "${YELLOW}🐳 Docker Containers:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Disk space
    echo -e "\n${YELLOW}💾 Disk Usage:${NC}"
    df -h | grep -E "(/$|/var)"
    
    # Memory usage
    echo -e "\n${YELLOW}🧠 Memory Usage:${NC}"
    free -h
}

# Function to run API tests
run_api_tests() {
    echo -e "\n${BLUE}🧪 Running API Health Tests...${NC}"
    
    # Test API Gateway
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API Gateway health check passed${NC}"
    else
        echo -e "${RED}❌ API Gateway health check failed (HTTP $response)${NC}"
    fi
    
    # Test Member Service
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Member Service health check passed${NC}"
    else
        echo -e "${RED}❌ Member Service health check failed (HTTP $response)${NC}"
    fi
    
    # Test Loan Service
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Loan Service health check passed${NC}"
    else
        echo -e "${RED}❌ Loan Service health check failed (HTTP $response)${NC}"
    fi
}

# Main health check
echo -e "${YELLOW}🚀 Starting comprehensive health check...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    exit 1
fi

# Check all services
failed_services=0
for service in "${SERVICES[@]}"; do
    IFS=':' read -r name port path <<< "$service"
    if ! check_service "$name" "$port" "$path"; then
        ((failed_services++))
    fi
done

# Check database
check_database

# Run API tests
run_api_tests

# Check system resources
check_resources

# Summary
echo -e "\n${YELLOW}📋 Health Check Summary:${NC}"
if [ $failed_services -eq 0 ]; then
    echo -e "${GREEN}🎉 All services are healthy!${NC}"
    echo -e "${BLUE}🌐 Your application is ready for use:${NC}"
    echo "• API Gateway: http://localhost:3000"
    echo "• Member Service: http://localhost:3001"
    echo "• Loan Service: http://localhost:3002"
    echo "• Web App: http://localhost:5173"
else
    echo -e "${RED}❌ $failed_services service(s) are not healthy${NC}"
    echo -e "${YELLOW}🔧 Check logs with: docker-compose logs -f [service-name]${NC}"
    exit 1
fi

echo -e "\n${YELLOW}💡 Tips:${NC}"
echo "• For continuous monitoring, consider setting up a cron job"
echo "• Configure alerts for service failures"
echo "• Monitor logs regularly: docker-compose logs -f"
echo "• Set up log rotation for production"