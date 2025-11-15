# 🖥 Local Editor Connection Guide

## 🎯 **Multiple Ways to Work with the Code Locally**

### **Option 1: VS Code (Recommended) - Local Development**

#### **A. Download and Open Locally:**
```bash
# Method 1: Git Clone
git clone https://github.com/your-username/cooperative-society-management.git
cd cooperative-society-management

# Method 2: Download ZIP
curl -L https://github.com/your-username/cooperative-society-management/archive/main.zip -o cooperative-society-management.zip
unzip cooperative-society-management.zip
cd cooperative-society-management-main

# Open in VS Code
code .
```

#### **B. VS Code Setup:**
```bash
# Install VS Code extensions recommended
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

#### **C. Development Workflow:**
```bash
# Install dependencies
pnpm install

# Build shared package
pnpm --filter @coop/shared build

# Start development servers (in separate terminals)
# Terminal 1: API Gateway
pnpm --filter @coop/api-gateway dev

# Terminal 2: Member Service  
pnpm --filter @coop/member-service dev

# Terminal 3: Loan Service
pnpm --filter @coop/loan-service dev

# Terminal 4: Web Frontend
pnpm --filter @coop/web dev
```

---

### **Option 2: GitHub Codespaces - Cloud Editor**

#### **A. Create Codespace:**
1. Go to: https://github.com/your-username/cooperative-society-management
2. Click green "Code" button
3. Select "Codespaces" tab
4. Click "New codespace"
5. Choose template: "Node.js & TypeScript"
6. Name it: "cooperative-society-dev"
7. Click "Create codespace"

#### **B. Work in Browser:**
- Full VS Code experience in browser
- Terminal access
- File explorer
- Debugging capabilities
- Extensions support

#### **C. Advantages:**
- No local setup required
- Pre-configured environment
- Git integration built-in
- Access from any device

---

### **Option 3: Gitpod - Cloud IDE**

#### **A. Create Gitpod:**
```bash
# Method 1: Browser
https://gitpod.io/#https://github.com/your-username/cooperative-society-management

# Method 2: CLI
gitpod https://github.com/your-username/cooperative-society-management
```

#### **B. Features:**
- VS Code-based interface
- Pre-configured Node.js environment
- Persistent storage
- Port forwarding for testing
- Git integration

---

### **Option 4: Local Development with Remote Server**

#### **A. Setup Local Development:**
```bash
# 1. Download the project
git clone https://github.com/your-username/cooperative-society-management.git
cd cooperative-society-management

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Start development servers
# Use the provided scripts or manual commands
```

#### **B. Port Forwarding for Testing:**
```bash
# If using remote server, forward ports:
ssh -L 3000:localhost:3000 user@remote-server
ssh -L 3001:localhost:3001 user@remote-server
ssh -L 3002:localhost:3002 user@remote-server
ssh -L 5173:localhost:5173 user@remote-server
```

---

## 🔧 **Development Environment Setup**

### **VS Code Configuration (.vscode/settings.json):**
```json
{
  "typescript.preferences.importModuleSpecifier": "node",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
    "**/coverage": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  },
  "terminal.integrated.defaultProfile.linux": "bash",
  "debug.node.autoAttach": "on"
}
```

### **Recommended VS Code Extensions:**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-yaml",
    "ms-vscode.vscode-docker",
    "formulahendry.auto-rename-tag",
    "ms-vscode.test-adapter-converter",
    "humao.restclient",
    "ms-vscode.github"
  ]
}
```

---

## 🚀 **Quick Start Commands**

### **For Local Development:**
```bash
# After cloning and navigating to project:
pnpm install                    # Install dependencies
pnpm --filter @coop/shared build  # Build shared package
pnpm test                      # Run all tests
./scripts/pre-deploy-check.sh    # Verify setup
```

### **Development Servers:**
```bash
# API Gateway (Port 3000)
pnpm --filter @coop/api-gateway dev

# Member Service (Port 3001)
pnpm --filter @coop/member-service dev

# Loan Service (Port 3002)
pnpm --filter @coop/loan-service dev

# Web Frontend (Port 5173)
pnpm --filter @coop/web dev
```

### **Testing Commands:**
```bash
# All tests
pnpm test

# Unit tests only
pnpm test:unit

# Integration tests only
pnpm test:integration

# Frontend tests only
pnpm --filter @coop/web test

# E2E tests (requires browsers)
pnpm test:e2e
```

---

## 🌐 **Accessing Services Locally**

### **Development URLs:**
- **API Gateway**: http://localhost:3000
- **Member Service**: http://localhost:3001
- **Loan Service**: http://localhost:3002
- **Web Frontend**: http://localhost:5173

### **Health Endpoints:**
- **API Gateway**: http://localhost:3000/health
- **Member Service**: http://localhost:3001/health
- **Loan Service**: http://localhost:3002/health

### **API Testing:**
```bash
# Test API Gateway
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/members
curl http://localhost:3000/api/v1/loans

# Test Member Service
curl http://localhost:3001/health
curl http://localhost:3001/members
curl -X POST http://localhost:3001/members -H "Content-Type: application/json" -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phoneNumber":"1234567890","membershipNumber":"MEM001"}'

# Test Loan Service
curl http://localhost:3002/health
curl http://localhost:3002/loans
curl -X POST http://localhost:3002/loans -H "Content-Type: application/json" -d '{"memberId":"member-123","amount":10000,"interestRate":5,"term":12}'
```

---

## 🔗 **Connecting to cto.new**

### **Option 1: GitHub Codespaces Integration**
1. Create GitHub Codespace (see Option 2 above)
2. In the codespace, install cto.new extension
3. Connect cto.new to the codespace
4. Work with the full VS Code experience

### **Option 2: Local VS Code with cto.new**
1. Install VS Code locally
2. Install cto.new extension in VS Code
3. Clone the repository locally
4. Open VS Code in the project directory
5. Connect cto.new to your local VS Code

### **Option 3: Browser-based cto.new**
1. Use Gitpod or GitHub Codespaces (Option 2 or 3)
2. Navigate to cto.new in browser
3. Connect to the cloud development environment
4. Work with the code directly in browser

---

## 📋 **Project Structure Overview**

```
cooperative-society-management/
├── 📁 apps/                    # Microservices
│   ├── 📁 api-gateway/          # Express.js API Gateway
│   ├── 📁 member-service/       # Express.js Member Service
│   ├── 📁 loan-service/         # Express.js Loan Service
│   └── 📁 web/                  # React Frontend
├── 📁 packages/                 # Shared Code
│   └── 📁 shared/               # Types & Utilities
├── 📁 scripts/                  # Automation Scripts
├── 📁 test/                     # Test Fixtures
├── 📋 .env.example               # Environment Template
├── 📋 docker-compose.yml          # Development Docker
├── 📋 docker-compose.prod.yml     # Production Docker
├── 📋 package.json               # Root Package Config
├── 📋 pnpm-workspace.yaml        # Monorepo Config
└── 📋 tsconfig.json               # TypeScript Config
```

---

## 🎯 **Recommended Workflow**

### **For Beginners:**
1. **Use GitHub Codespaces** - Easiest start
2. **No local setup required**
3. **Full VS Code experience**
4. **Pre-configured environment**

### **For Intermediate/Advanced:**
1. **Clone locally** - Full control
2. **Use VS Code** - Best editor experience
3. **Multiple terminals** - Run services separately
4. **Local database** - Full development setup

### **For Team Collaboration:**
1. **GitHub Codespaces** - Shared environment
2. **Gitpod** - Cloud IDE with persistence
3. **Remote development** - SSH to shared server
4. **Docker Compose** - Consistent environment

---

## 🔧 **Troubleshooting Local Development**

### **Common Issues:**
```bash
# Port already in use
sudo lsof -i :3000
sudo kill -9 $(sudo lsof -t -i:3000)

# Permission denied
chmod +x scripts/deploy.sh
chmod +x scripts/health-check.sh

# Module not found
pnpm install
rm -rf node_modules package-lock.json
pnpm install

# TypeScript errors
pnpm --filter @coop/shared build
```

### **Development Tips:**
```bash
# Watch for file changes
pnpm --filter @coop/web dev --watch

# Run tests in watch mode
pnpm test:watch

# Clean build artifacts
pnpm -r run clean

# Reset database
# Delete local database files and restart services
```

---

## 🎯 **Next Steps**

1. **Choose your preferred method** from the options above
2. **Set up your development environment**
3. **Install dependencies and run tests**
4. **Start development servers**
5. **Open your browser and test the application**
6. **Make changes and see them reflected immediately**

---

## 📞 **Support Resources**

### **Documentation:**
- 📖 `README.md` - Complete setup guide
- 📖 `DEPLOYMENT_SUMMARY.md` - Deployment options
- 📖 `SHARED_HOSTING_GUIDE.md` - Hosting instructions
- 📖 `LOCAL_EDITOR_GUIDE.md` - This guide

### **Scripts:**
- 🔧 `./scripts/deploy.sh` - Deployment automation
- 🔧 `./scripts/pre-deploy-check.sh` - Pre-deployment validation
- 🔧 `./scripts/health-check.sh` - Production monitoring

### **Testing:**
- 🧪 `pnpm test` - Run all tests
- 🧪 `pnpm test:unit` - Unit tests only
- 🧪 `pnpm test:integration` - Integration tests only
- 🧪 `pnpm test:e2e` - End-to-end tests

---

## 🎉 **Ready to Start!**

Choose your preferred method and start developing your Cooperative Society Management system locally. All the tools, scripts, and documentation are provided to help you get started quickly!

**🚀 Happy coding!**