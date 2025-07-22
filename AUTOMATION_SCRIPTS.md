# 🤖 SCRIPTS TỰ ĐỘNG HÓA CHO DỰ ÁN DOCSHARE

## 📋 DANH SÁCH SCRIPTS

### **1. setup-project.sh** - Khởi tạo dự án
### **2. daily-sync.sh** - Đồng bộ hàng ngày
### **3. create-pr.sh** - Tạo Pull Request
### **4. deploy-check.sh** - Kiểm tra trước deploy

---

## 🚀 SCRIPT 1: SETUP PROJECT

### **setup-project.sh**
```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DocShare Project Setup Script${NC}"
echo -e "${BLUE}=================================${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Get user input
read -p "Enter GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: DocShare-Project): " REPO_NAME
REPO_NAME=${REPO_NAME:-DocShare-Project}

read -p "Enter your name for commits: " USER_NAME
read -p "Enter your email for commits: " USER_EMAIL

# Setup git config
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"

print_status "Git configuration set"

# Create project structure
echo -e "${BLUE}📁 Creating project structure...${NC}"

mkdir -p backend/{config,controllers,middleware,models,routes,scripts,utils,validators}
mkdir -p DocShare/src/{app,components,hooks,lib,providers,types}
mkdir -p nginx

print_status "Project structure created"

# Create initial files
echo -e "${BLUE}📝 Creating initial files...${NC}"

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.next/
out/
dist/
build/

# Database
*.db
*.sqlite

# Uploads
uploads/
temp/

# Logs
logs/
*.log

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF

# Create basic README
cat > README.md << EOF
# 📄 DocShare - Nền tảng Chia sẻ Tài liệu

> Ứng dụng web hiện đại cho phép người dùng upload, chia sẻ và quản lý tài liệu trực tuyến.

## 👥 Thành viên nhóm
- **Liễu Kiện An** - Team Leader & Backend Developer
- **Trương Mỹ Duyên** - Frontend Developer
- **Trương Hoàng Giang** - DevOps & Integration Engineer

## 🛠️ Công nghệ sử dụng
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **DevOps**: Docker, Nginx, MongoDB Atlas

## 📊 Trạng thái dự án
🚧 **Đang phát triển** - Giai đoạn khởi tạo

## 🚀 Cài đặt và chạy

### Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd DocShare
npm install
npm run dev
\`\`\`

## 📞 Liên hệ
GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME
EOF

print_status "Initial files created"

# Initialize git repository
echo -e "${BLUE}🔧 Initializing Git repository...${NC}"

git init
git add .
git commit -m "feat: initial project setup with basic structure"

print_status "Git repository initialized"

# Add remote origin
echo -e "${BLUE}🌐 Setting up remote repository...${NC}"
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

print_warning "Don't forget to create the repository on GitHub first!"
print_warning "Then run: git push -u origin main"

echo -e "${GREEN}🎉 Project setup completed successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Create repository on GitHub: https://github.com/new"
echo -e "2. Run: git push -u origin main"
echo -e "3. Follow the development timeline in GITHUB_DEPLOYMENT_GUIDE.md"
```

---

## 🔄 SCRIPT 2: DAILY SYNC

### **daily-sync.sh**
```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Daily Sync Script${NC}"
echo -e "${BLUE}===================${NC}"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}⚠️  You have uncommitted changes!${NC}"
    echo -e "${YELLOW}Please commit or stash your changes first.${NC}"
    git status --short
    exit 1
fi

# Fetch latest changes
echo -e "${BLUE}📥 Fetching latest changes...${NC}"
git fetch origin

# Switch to main and pull
echo -e "${BLUE}🔄 Updating main branch...${NC}"
git checkout main
git pull origin main

# Switch back to working branch
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${BLUE}🔄 Switching back to $CURRENT_BRANCH...${NC}"
    git checkout $CURRENT_BRANCH
    
    # Rebase with main
    echo -e "${BLUE}🔄 Rebasing with main...${NC}"
    if git rebase main; then
        echo -e "${GREEN}✅ Rebase successful${NC}"
    else
        echo -e "${RED}❌ Rebase failed - please resolve conflicts${NC}"
        echo -e "${YELLOW}After resolving conflicts, run:${NC}"
        echo -e "git add ."
        echo -e "git rebase --continue"
        exit 1
    fi
fi

echo -e "${GREEN}🎉 Daily sync completed successfully!${NC}"

# Show status
echo -e "${BLUE}📊 Current status:${NC}"
git status --short
```

---

## 📤 SCRIPT 3: CREATE PULL REQUEST

### **create-pr.sh**
```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📤 Create Pull Request Script${NC}"
echo -e "${BLUE}=============================${NC}"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo -e "${RED}❌ Cannot create PR from main branch${NC}"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes. Committing them first...${NC}"
    
    read -p "Enter commit message: " COMMIT_MSG
    git add .
    git commit -m "$COMMIT_MSG"
fi

# Push current branch
echo -e "${BLUE}📤 Pushing current branch...${NC}"
git push origin $CURRENT_BRANCH

# Generate PR template
PR_TITLE="feat: $(echo $CURRENT_BRANCH | sed 's/-/ /g')"
PR_BODY="## 📋 Mô tả thay đổi
Brief description of changes in this PR

## 🎯 Loại thay đổi
- [ ] Bug fix
- [ ] New feature  
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing
- [ ] Đã test trên local
- [ ] Đã test integration
- [ ] No console errors

## 📝 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated"

echo -e "${GREEN}✅ Branch pushed successfully!${NC}"
echo -e "${BLUE}📋 PR Template:${NC}"
echo -e "${YELLOW}Title: $PR_TITLE${NC}"
echo ""
echo "$PR_BODY"
echo ""
echo -e "${BLUE}🌐 Create PR at:${NC}"
echo "https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/compare/main...$CURRENT_BRANCH"
```

---

## ✅ SCRIPT 4: DEPLOYMENT CHECK

### **deploy-check.sh**
```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}✅ Deployment Check Script${NC}"
echo -e "${BLUE}==========================${NC}"

ERRORS=0

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${RED}❌ Not on main branch (currently on: $CURRENT_BRANCH)${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ On main branch${NC}"
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ Uncommitted changes found${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# Check backend
echo -e "${BLUE}🔍 Checking backend...${NC}"
if [[ -f "backend/package.json" ]]; then
    cd backend
    
    # Check if node_modules exists
    if [[ ! -d "node_modules" ]]; then
        echo -e "${YELLOW}⚠️  Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Check for syntax errors
    if npm run test > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend tests pass${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend tests not configured or failing${NC}"
    fi
    
    cd ..
else
    echo -e "${RED}❌ Backend package.json not found${NC}"
    ((ERRORS++))
fi

# Check frontend
echo -e "${BLUE}🔍 Checking frontend...${NC}"
if [[ -f "DocShare/package.json" ]]; then
    cd DocShare
    
    # Check if node_modules exists
    if [[ ! -d "node_modules" ]]; then
        echo -e "${YELLOW}⚠️  Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Check build
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend builds successfully${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        ((ERRORS++))
    fi
    
    cd ..
else
    echo -e "${RED}❌ Frontend package.json not found${NC}"
    ((ERRORS++))
fi

# Check Docker
echo -e "${BLUE}🔍 Checking Docker configuration...${NC}"
if [[ -f "docker-compose.yml" ]]; then
    echo -e "${GREEN}✅ Docker Compose file found${NC}"
    
    # Validate docker-compose file
    if docker-compose config > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker Compose configuration valid${NC}"
    else
        echo -e "${RED}❌ Docker Compose configuration invalid${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠️  Docker Compose file not found${NC}"
fi

# Check environment files
echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
if [[ -f "backend/.env.example" ]]; then
    echo -e "${GREEN}✅ Backend .env.example found${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env.example not found${NC}"
fi

# Summary
echo -e "${BLUE}📊 Deployment Check Summary${NC}"
echo -e "${BLUE}===========================${NC}"

if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found. Please fix before deploying.${NC}"
    exit 1
fi
```

---

## 🛠️ CÁCH SỬ DỤNG SCRIPTS

### **1. Cấp quyền thực thi:**
```bash
chmod +x setup-project.sh
chmod +x daily-sync.sh  
chmod +x create-pr.sh
chmod +x deploy-check.sh
```

### **2. Chạy scripts:**
```bash
# Khởi tạo dự án (chỉ chạy 1 lần)
./setup-project.sh

# Đồng bộ hàng ngày
./daily-sync.sh

# Tạo Pull Request
./create-pr.sh

# Kiểm tra trước deploy
./deploy-check.sh
```

### **3. Tích hợp vào workflow:**
```bash
# Thêm vào .bashrc hoặc .zshrc
alias ds-sync="./daily-sync.sh"
alias ds-pr="./create-pr.sh"  
alias ds-check="./deploy-check.sh"
```

---

## 📋 CHECKLIST SỬ DỤNG

### **Hàng ngày:**
- [ ] Chạy `./daily-sync.sh` trước khi bắt đầu làm việc
- [ ] Commit thường xuyên với message rõ ràng
- [ ] Chạy `./create-pr.sh` khi hoàn thành feature

### **Trước deploy:**
- [ ] Chạy `./deploy-check.sh`
- [ ] Fix tất cả errors
- [ ] Test trên local environment
- [ ] Merge PR vào main branch

### **Weekly:**
- [ ] Review tất cả open PRs
- [ ] Clean up merged branches
- [ ] Update documentation nếu cần
