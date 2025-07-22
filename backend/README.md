# DocShare Backend API

Backend API cho ứng dụng DocShare - Nền tảng chia sẻ tài liệu trực tuyến.

## 🚀 Tính năng

- **Authentication & Authorization**: JWT-based auth với role-based access
- **Document Management**: Upload, view, download, search tài liệu
- **File Storage**: Local file storage với validation và security
- **User Management**: Profile, bookmarks, activities, statistics
- **Security**: Rate limiting, input validation, XSS protection
- **Logging**: Comprehensive logging system
- **Database**: MongoDB với Mongoose ODM

## 🛠️ Công nghệ sử dụng

- **Node.js** & **Express.js**
- **MongoDB** với **Mongoose**
- **JWT** cho authentication
- **Multer** cho file upload
- **bcryptjs** cho password hashing
- **Helmet** cho security headers
- **Express Rate Limit** cho rate limiting

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB Atlas account hoặc local MongoDB
- 1GB+ free disk space cho file storage

## ⚙️ Cài đặt

1. **Clone repository và di chuyển vào thư mục backend:**
   ```bash
   cd backend
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Tạo file .env từ .env.example:**
   ```bash
   cp .env.example .env
   ```

4. **Cấu hình environment variables trong .env:**
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/docshare

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
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

5. **Seed database với dữ liệu mẫu (optional):**
   ```bash
   npm run seed
   ```

6. **Chạy server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Tên người dùng",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Document Endpoints

#### Get Public Documents
```http
GET /api/documents?page=1&limit=10&search=react&filetype=pdf
```

#### Get My Documents
```http
GET /api/documents/my?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Document
```http
GET /api/documents/:id
Authorization: Bearer <token> (optional for public docs)
```

#### Upload Document
```http
POST /api/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <file>,
  "title": "Tiêu đề tài liệu",
  "description": "Mô tả tài liệu",
  "subject": "Chủ đề",
  "ispublic": "true",
  "keywords": "keyword1,keyword2",
  "tags": "tag1,tag2"
}
```

#### Download Document
```http
GET /api/documents/:id/download
Authorization: Bearer <token> (optional for public docs)
```

#### Update Document
```http
PUT /api/documents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tiêu đề mới",
  "description": "Mô tả mới",
  "ispublic": false
}
```

#### Delete Document
```http
DELETE /api/documents/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Get User Statistics
```http
GET /api/users/stats
Authorization: Bearer <token>
```

#### Get User Activities
```http
GET /api/users/activities?page=1&limit=20
Authorization: Bearer <token>
```

#### Get User Bookmarks
```http
GET /api/users/bookmarks?page=1&limit=10
Authorization: Bearer <token>
```

#### Add Bookmark
```http
POST /api/users/bookmarks/:documentId
Authorization: Bearer <token>
Content-Type: application/json

{
  "note": "Ghi chú bookmark (optional)"
}
```

#### Remove Bookmark
```http
DELETE /api/users/bookmarks/:documentId
Authorization: Bearer <token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt với salt rounds
- **Rate Limiting**: Prevent abuse và brute force attacks
- **Input Validation**: Comprehensive validation với express-validator
- **XSS Protection**: Input sanitization và security headers
- **File Upload Security**: File type validation và size limits
- **CORS**: Configured cho frontend integration

## 📁 Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── documentController.js # Document management
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── cors.js             # CORS configuration
│   ├── errorHandler.js     # Error handling
│   ├── rateLimiter.js      # Rate limiting
│   ├── security.js         # Security middleware
│   ├── upload.js           # File upload handling
│   └── validation.js       # Input validation
├── models/
│   ├── User.js             # User schema
│   ├── Document.js         # Document schema
│   ├── Bookmark.js         # Bookmark schema
│   ├── UserActivity.js     # Activity logging
│   └── DocumentStats.js    # Document statistics
├── routes/
│   ├── auth.js             # Auth routes
│   ├── documents.js        # Document routes
│   └── users.js            # User routes
├── scripts/
│   └── seedDatabase.js     # Database seeding
├── utils/
│   ├── fileUtils.js        # File utilities
│   └── logger.js           # Logging system
├── validators/
│   ├── authValidator.js    # Auth validation rules
│   └── documentValidator.js # Document validation
├── uploads/                # File storage directory
├── logs/                   # Application logs
└── server.js              # Main application file
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📊 Monitoring & Logs

- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Request logging với response times
- Authentication event logging
- File operation logging

## 🚀 Deployment

1. **Set NODE_ENV to production**
2. **Configure production MongoDB URI**
3. **Set strong JWT_SECRET**
4. **Configure proper CORS origins**
5. **Set up reverse proxy (nginx)**
6. **Enable HTTPS**
7. **Set up log rotation**

## 🤝 Integration với Frontend

Backend này được thiết kế để tương thích hoàn toàn với frontend DocShare. Các response format và data structures match với TypeScript interfaces trong frontend.

## 📝 Sample Accounts (sau khi seed)

- **Admin**: admin@docshare.com / admin123
- **User 1**: user1@example.com / user123  
- **User 2**: user2@example.com / user123

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Kiểm tra MONGODB_URI trong .env
   - Đảm bảo IP được whitelist trong MongoDB Atlas

2. **File Upload Fails**
   - Kiểm tra MAX_FILE_SIZE setting
   - Đảm bảo uploads directory có write permissions

3. **CORS Errors**
   - Kiểm tra FRONTEND_URL trong .env
   - Đảm bảo frontend URL được configure đúng

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue trong repository hoặc liên hệ team phát triển.
