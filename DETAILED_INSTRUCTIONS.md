# 📋 HƯỚNG DẪN CHI TIẾT CHO TỪNG THÀNH VIÊN

## 👨‍💻 LIỄU KIỆN AN - TEAM LEADER & BACKEND DEVELOPER

### **NHIỆM VỤ CHÍNH:**
- Tạo và quản lý GitHub repository
- Phát triển Backend API với Node.js/Express
- Thiết kế và quản lý Database MongoDB
- Review code của các thành viên khác
- Merge các Pull Request

### **LỊCH TRÌNH CÔNG VIỆC:**

#### **Tuần 1: Khởi tạo dự án**
```bash
# 1. Tạo repository trên GitHub
# Tên repo: DocShare-Project
# Description: "Nền tảng chia sẻ tài liệu trực tuyến - Nhóm [Tên nhóm]"

# 2. Clone và setup local
git clone https://github.com/[username]/DocShare-Project.git
cd DocShare-Project

# 3. Tạo cấu trúc thư mục cơ bản
mkdir backend DocShare nginx
touch README.md .gitignore

# 4. Commit đầu tiên
git add .
git commit -m "feat: initial project setup with basic structure"
git push origin main
```

#### **Files cần tạo trong Tuần 1:**
1. **README.md** (cơ bản):
```markdown
# DocShare - Nền tảng Chia sẻ Tài liệu

## Thành viên nhóm:
- Liễu Kiện An - Backend Developer
- Trương Mỹ Duyên - Frontend Developer  
- Trương Hoàng Giang - DevOps Engineer

## Công nghệ sử dụng:
- Backend: Node.js, Express.js, MongoDB
- Frontend: Next.js, React, TypeScript
- Deployment: Docker, Nginx

## Trạng thái: Đang phát triển 🚧
```

2. **.gitignore**:
```
node_modules/
.env
.env.local
.next/
dist/
build/
uploads/
logs/
*.log
.DS_Store
```

3. **backend/package.json**:
```json
{
  "name": "docshare-backend",
  "version": "1.0.0",
  "description": "Backend API cho DocShare",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

#### **Tuần 2: Authentication System**
**Files cần tạo:**
- `backend/server.js` (cơ bản)
- `backend/config/database.js`
- `backend/models/User.js`
- `backend/controllers/authController.js`
- `backend/routes/auth.js`
- `backend/middleware/auth.js`

**Commit messages:**
```bash
git commit -m "feat: add MongoDB connection and User model"
git commit -m "feat: implement user registration and login"
git commit -m "feat: add JWT authentication middleware"
```

#### **Tuần 3-4: Document Management**
**Files cần tạo:**
- `backend/models/Document.js`
- `backend/controllers/documentController.js`
- `backend/routes/documents.js`
- `backend/middleware/upload.js`
- `backend/utils/fileUtils.js`

---

## 👩‍💻 TRƯƠNG MỸ DUYÊN - FRONTEND DEVELOPER

### **NHIỆM VỤ CHÍNH:**
- Phát triển giao diện người dùng với Next.js/React
- Thiết kế UI/UX components
- Tích hợp Frontend với Backend API
- Responsive design và animations

### **LỊCH TRÌNH CÔNG VIỆC:**

#### **Tuần 2: Frontend Foundation**
```bash
# 1. Tạo branch riêng
git checkout -b frontend-development

# 2. Khởi tạo Next.js project
cd DocShare
npx create-next-app@latest . --typescript --tailwind --eslint --app

# 3. Cài đặt dependencies bổ sung
npm install @radix-ui/react-* framer-motion lucide-react axios
```

#### **Files cần tạo trong Tuần 2-3:**
1. **DocShare/src/app/layout.tsx**
2. **DocShare/src/app/page.tsx** (landing page)
3. **DocShare/src/components/ui/** (base components)
4. **DocShare/src/app/auth/login/page.tsx**
5. **DocShare/src/app/auth/register/page.tsx**

**Commit strategy:**
```bash
# Sau mỗi feature hoàn thành
git add .
git commit -m "feat: add authentication pages UI"
git push origin frontend-development

# Tạo Pull Request để merge vào main
```

#### **Tuần 3-4: Document Interface**
**Files cần tạo:**
- `DocShare/src/app/documents/page.tsx`
- `DocShare/src/app/documents/upload/page.tsx`
- `DocShare/src/components/documents/`
- `DocShare/src/lib/document-service.ts`

#### **Tuần 4-5: Dashboard & User Interface**
**Files cần tạo:**
- `DocShare/src/app/dashboard/page.tsx`
- `DocShare/src/components/dashboard/`
- `DocShare/src/app/bookmarks/page.tsx`

---

## 🔧 TRƯƠNG HOÀNG GIANG - DEVOPS & INTEGRATION

### **NHIỆM VỤ CHÍNH:**
- Thiết lập Docker containers
- Cấu hình Nginx reverse proxy
- Viết scripts deployment
- Testing và documentation
- Database seeding

### **LỊCH TRÌNH CÔNG VIỆC:**

#### **Tuần 6: Docker Setup**
```bash
# 1. Tạo branch riêng
git checkout -b devops-integration

# 2. Tạo Docker files
```

#### **Files cần tạo trong Tuần 6:**
1. **docker-compose.yml**
2. **docker-compose.dev.yml**
3. **backend/Dockerfile**
4. **DocShare/Dockerfile**
5. **nginx/nginx.conf**

#### **Tuần 7: Scripts & Automation**
**Files cần tạo:**
- `start-backend.sh`
- `start-frontend.sh`
- `backend/scripts/seedDatabase.js`
- `backend/scripts/init-mongo.js`

#### **Tuần 8: Documentation & Testing**
**Files cần tạo:**
- `DOCKER_README.md`
- `API_INTEGRATION_GUIDE.md`
- `backend/config/swagger.js`
- Cập nhật `README.md` chi tiết

---

## 🔄 QUY TRÌNH COLLABORATION

### **Hàng ngày:**
1. **Pull latest changes:**
```bash
git checkout main
git pull origin main
git checkout [your-branch]
git rebase main
```

2. **Trước khi commit:**
```bash
# Test code
npm test  # hoặc npm run dev

# Commit với message rõ ràng
git add .
git commit -m "feat: [mô tả ngắn gọn]"
```

3. **Push và tạo PR:**
```bash
git push origin [your-branch]
# Tạo Pull Request trên GitHub
# Tag @LieuKienAn để review
```

### **Weekly Review (Chủ nhật):**
- Demo tính năng đã hoàn thành
- Review code và merge PR
- Planning cho tuần tiếp theo
- Resolve conflicts nếu có

---

## 📋 CHECKLIST CHO MỖI COMMIT

### **Liễu Kiện An:**
- [ ] Backend API hoạt động đúng
- [ ] Database schema hợp lệ
- [ ] Authentication/Authorization work
- [ ] Error handling đầy đủ
- [ ] API documentation updated

### **Trương Mỹ Duyên:**
- [ ] UI components render đúng
- [ ] Responsive trên mobile/desktop
- [ ] API integration hoạt động
- [ ] Form validation work
- [ ] Loading states implemented

### **Trương Hoàng Giang:**
- [ ] Docker containers build thành công
- [ ] Scripts chạy không lỗi
- [ ] Documentation đầy đủ và rõ ràng
- [ ] Environment variables configured
- [ ] Production ready

---

## 🚨 TROUBLESHOOTING

### **Common Issues:**
1. **Merge Conflicts:**
   - Communicate trước khi resolve
   - Test thoroughly sau khi resolve
   - Never force push to main

2. **API Integration Issues:**
   - Check CORS settings
   - Verify API endpoints
   - Check environment variables

3. **Docker Issues:**
   - Clear Docker cache: `docker system prune`
   - Rebuild images: `docker-compose build --no-cache`
   - Check logs: `docker-compose logs [service]`

---

## 📞 COMMUNICATION CHANNELS

- **Daily Updates**: Telegram group
- **Code Review**: GitHub PR comments
- **Emergency**: Phone call
- **Weekly Meeting**: Google Meet/Zoom

**Thời gian làm việc:** 9:00 AM - 6:00 PM (flexible)
**Response time:** Tối đa 2 giờ trong giờ làm việc
