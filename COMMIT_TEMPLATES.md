# 📝 TEMPLATES CHO TỪNG GIAI ĐOẠN COMMIT

## 🎯 GIAI ĐOẠN 1: KHỞI TẠO DỰ ÁN
**Người thực hiện: Liễu Kiện An**

### **Commit 1: "feat: initial project setup"**
**Files cần tạo:**

#### **README.md**
```markdown
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

## 🚀 Tính năng dự kiến
- [ ] Đăng ký/Đăng nhập người dùng
- [ ] Upload và quản lý tài liệu
- [ ] Tìm kiếm và lọc tài liệu
- [ ] Dashboard thống kê
- [ ] Bookmark tài liệu yêu thích

## 📞 Liên hệ
Email: [email-nhom]@gmail.com
```

#### **.gitignore**
```
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
```

---

### **Commit 2: "feat: setup backend basic structure"**
**Files cần tạo:**

#### **backend/package.json**
```json
{
  "name": "docshare-backend",
  "version": "1.0.0",
  "description": "Backend API cho ứng dụng DocShare",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "keywords": ["docshare", "document", "sharing", "express", "mongodb"],
  "author": "DocShare Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### **backend/.env.example**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/docshare

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,ppt,pptx,xls,xlsx

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### **backend/server.js** (cơ bản)
```javascript
const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DocShare API is running',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 🔐 GIAI ĐOẠN 2: AUTHENTICATION SYSTEM
**Người thực hiện: Liễu Kiện An**

### **Commit 3: "feat: add MongoDB connection and User model"**

#### **backend/config/database.js**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### **backend/models/User.js** (simplified version)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
    trim: true,
    maxlength: [100, 'Tên không được quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Encrypt password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## 🎨 GIAI ĐOẠN 3: FRONTEND FOUNDATION
**Người thực hiện: Trương Mỹ Duyên**

### **Commit 6: "feat: initialize Next.js frontend"**

#### **DocShare/package.json** (simplified)
```json
{
  "name": "docshare-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.2.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "axios": "^1.10.0"
  },
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "15.2.4"
  }
}
```

#### **DocShare/src/app/layout.tsx** (basic)
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocShare",
  description: "Nền tảng chia sẻ tài liệu trực tuyến",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <header>
          <nav className="bg-blue-600 text-white p-4">
            <h1 className="text-xl font-bold">DocShare</h1>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2024 DocShare Team</p>
        </footer>
      </body>
    </html>
  );
}
```

#### **DocShare/src/app/page.tsx** (basic)
```tsx
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Chào mừng đến với DocShare
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Nền tảng chia sẻ tài liệu trực tuyến hiện đại
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Đăng nhập
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🐳 GIAI ĐOẠN 7: DOCKER SETUP
**Người thực hiện: Trương Hoàng Giang**

### **Commit 19: "feat: add Docker configuration"**

#### **docker-compose.yml** (basic)
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/docshare
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./DocShare
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    volumes:
      - ./DocShare:/app
      - /app/node_modules

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

#### **backend/Dockerfile** (basic)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

---

## 📋 COMMIT MESSAGE EXAMPLES

### **Good Commit Messages:**
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve file upload validation issue"
git commit -m "docs: update API documentation"
git commit -m "style: improve dashboard UI components"
git commit -m "refactor: optimize database queries"
git commit -m "test: add unit tests for auth controller"
git commit -m "chore: update dependencies"
```

### **Bad Commit Messages:**
```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
git commit -m "work in progress"
```

---

## 🔄 MERGE REQUEST TEMPLATE

```markdown
## 📋 Mô tả thay đổi
Brief description of what this PR does

## 🎯 Loại thay đổi
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing
- [ ] Đã test trên local
- [ ] Đã test integration với API
- [ ] Đã test responsive design

## 📸 Screenshots (nếu có UI changes)
[Attach screenshots here]

## 📝 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```
