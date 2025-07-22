# 📄 DocShare - Nền tảng Chia sẻ Tài liệu

Một ứng dụng web hiện đại cho phép người dùng upload, chia sẻ và quản lý tài liệu trực tuyến.

## 🏗️ Kiến trúc Dự án

```
DocShare/
├── 🎨 DocShare/          # Frontend (Next.js + TypeScript)
├── ⚙️ backend/           # Backend API (Express.js + MongoDB)
├── 🚀 start-backend.sh   # Script khởi động backend
├── 🚀 start-frontend.sh  # Script khởi động frontend
└── 📚 README.md          # Tài liệu này
```

## ✨ Tính năng chính

### 🔐 Authentication & Authorization
- Đăng ký/Đăng nhập với JWT
- Quản lý profile người dùng
- Bảo mật với bcrypt password hashing

### 📄 Quản lý Tài liệu
- Upload file (PDF, DOC, DOCX, TXT, PPT, XLS)
- Xem trước tài liệu
- Download tài liệu
- Tìm kiếm và lọc tài liệu
- Tài liệu công khai/riêng tư

### 👤 Quản lý Người dùng
- Dashboard với thống kê
- Bookmark tài liệu yêu thích
- Lịch sử hoạt động
- Quản lý dung lượng storage

### 🛡️ Bảo mật
- Rate limiting
- Input validation & sanitization
- XSS protection
- File upload security
- CORS configuration

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 15.2.4** với App Router
- **React 19** và **TypeScript**
- **Tailwind CSS** cho styling
- **shadcn/ui** cho components
- **Framer Motion** cho animations

### Backend
- **Node.js** với **Express.js**
- **MongoDB Atlas** với **Mongoose**
- **JWT** cho authentication
- **Multer** cho file upload
- **bcryptjs** cho password hashing

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm hoặc yarn
- MongoDB Atlas account

### 1. Clone dự án
```bash
git clone <repository-url>
cd DocShare
```

### 2. Cài đặt Backend
```bash
# Sử dụng script tự động
./start-backend.sh

# Hoặc thủ công
cd backend
npm install
cp .env.example .env
# Cập nhật MongoDB URI trong .env
npm run seed  # Tạo dữ liệu mẫu
npm run dev   # Chạy backend
```

### 3. Cài đặt Frontend
```bash
# Sử dụng script tự động (terminal mới)
./start-frontend.sh

# Hoặc thủ công
cd DocShare
npm install
npm run dev   # Chạy frontend
```

### 4. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## ⚙️ Cấu hình

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://docshare:docshare123@docshare.jvs2hih.mongodb.net/docshare
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,ppt,pptx,xls,xlsx
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

## 🧪 Testing

### Test Backend API
```bash
cd backend
node test-api.js
```

### Test Frontend
```bash
cd DocShare
npm run build  # Test build
npm run lint   # Test linting
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  storageUsed: Number,
  storageLimit: Number,
  role: String (user/admin),
  createdat: Date,
  updatedat: Date
}
```

### Documents Collection
```javascript
{
  title: String,
  description: String,
  fileurl: String,
  filetype: String,
  filesize: Number,
  ispublic: Boolean,
  userid: ObjectId,
  keywords: [String],
  tags: [String],
  createdat: Date,
  updatedat: Date
}
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### Documents
- `GET /api/documents` - Lấy tài liệu công khai
- `POST /api/documents` - Upload tài liệu
- `GET /api/documents/:id` - Xem tài liệu
- `GET /api/documents/:id/download` - Download tài liệu
- `PUT /api/documents/:id` - Cập nhật tài liệu
- `DELETE /api/documents/:id` - Xóa tài liệu

### Users
- `GET /api/users/stats` - Thống kê user
- `GET /api/users/bookmarks` - Lấy bookmarks
- `POST /api/users/bookmarks/:id` - Thêm bookmark
- `DELETE /api/users/bookmarks/:id` - Xóa bookmark

## 👥 Tài khoản mẫu

Sau khi chạy `npm run seed` trong backend:

- **Admin**: admin@docshare.com / admin123
- **User 1**: user1@example.com / user123
- **User 2**: user2@example.com / user123

## 🐛 Troubleshooting

### Backend không kết nối được MongoDB
- Kiểm tra MongoDB URI trong `.env`
- Đảm bảo IP được whitelist trong MongoDB Atlas
- Kiểm tra network connection

### Frontend không gọi được API
- Kiểm tra backend đang chạy trên port 5000
- Kiểm tra CORS configuration
- Kiểm tra `.env.local` có đúng API URL

### File upload không hoạt động
- Kiểm tra `MAX_FILE_SIZE` setting
- Đảm bảo `uploads` directory có write permissions
- Kiểm tra file type có trong `ALLOWED_FILE_TYPES`

## 📝 Development Notes

### Thêm file type mới
1. Cập nhật `ALLOWED_FILE_TYPES` trong `.env`
2. Cập nhật validation trong backend
3. Cập nhật frontend file picker

### Thêm API endpoint mới
1. Tạo route trong `backend/routes/`
2. Tạo controller trong `backend/controllers/`
3. Thêm validation nếu cần
4. Cập nhật frontend service

## 🚀 Deployment

### Backend
1. Deploy lên Heroku/Railway/DigitalOcean
2. Cấu hình environment variables
3. Set up MongoDB Atlas production
4. Configure domain và SSL

### Frontend
1. Deploy lên Vercel/Netlify
2. Cập nhật API URLs cho production
3. Configure custom domain

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue trong repository hoặc liên hệ team phát triển.

---

**Happy Coding! 🚀**
