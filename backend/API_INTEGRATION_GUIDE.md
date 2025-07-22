# API Integration Guide cho Frontend DocShare

Hướng dẫn tích hợp backend API với frontend DocShare.

## 🔗 Base Configuration

### API Base URL
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

### Axios Configuration
```javascript
// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Authentication Integration

### Replace Mock Auth Service
```javascript
// lib/auth-service.js
import api from './api';

export const authService = {
  // Đăng ký
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      return response.data.data.user;
    }
    throw new Error(response.data.error);
  },

  // Đăng nhập
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      return response.data.data.user;
    }
    throw new Error(response.data.error);
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },

  // Đăng xuất
  async logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  },

  // Cập nhật thông tin
  async updateProfile(userData) {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data.data.user;
  },

  // Đổi mật khẩu
  async changePassword(passwordData) {
    const response = await api.put('/auth/updatepassword', passwordData);
    localStorage.setItem('token', response.data.data.token);
    return true;
  }
};
```

### Update Auth Provider
```javascript
// providers/auth-provider.tsx
import { authService } from '@/lib/auth-service';

// Replace mock functions với real API calls
const AuthProvider = ({ children }) => {
  // ... existing code ...

  const login = async (credentials) => {
    try {
      setLoading(true);
      const user = await authService.login(credentials);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ... similar updates for other functions
};
```

## 📄 Document Service Integration

### Replace Mock Document Service
```javascript
// lib/document-service.js
import api from './api';

export const documentService = {
  // Lấy tài liệu công khai
  async getPublicDocuments(params = {}) {
    const response = await api.get('/documents', { params });
    return response.data.data;
  },

  // Lấy tài liệu của user
  async getMyDocuments(params = {}) {
    const response = await api.get('/documents/my', { params });
    return response.data.data;
  },

  // Lấy chi tiết tài liệu
  async getDocument(id) {
    const response = await api.get(`/documents/${id}`);
    return response.data.data.document;
  },

  // Upload tài liệu
  async uploadDocument(formData) {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.document;
  },

  // Cập nhật tài liệu
  async updateDocument(id, data) {
    const response = await api.put(`/documents/${id}`, data);
    return response.data.data.document;
  },

  // Xóa tài liệu
  async deleteDocument(id) {
    await api.delete(`/documents/${id}`);
    return true;
  },

  // Download tài liệu
  async downloadDocument(id) {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from response headers
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'document';
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Tìm kiếm tài liệu
  async searchDocuments(query, params = {}) {
    const response = await api.get('/documents', {
      params: { search: query, ...params }
    });
    return response.data.data;
  }
};
```

## 👤 User Service Integration

### User Management Service
```javascript
// lib/user-service.js
import api from './api';

export const userService = {
  // Lấy thống kê user
  async getUserStats() {
    const response = await api.get('/users/stats');
    return response.data.data.stats;
  },

  // Lấy hoạt động user
  async getUserActivities(params = {}) {
    const response = await api.get('/users/activities', { params });
    return response.data.data;
  },

  // Lấy bookmarks
  async getBookmarks(params = {}) {
    const response = await api.get('/users/bookmarks', { params });
    return response.data.data;
  },

  // Thêm bookmark
  async addBookmark(documentId, note = '') {
    const response = await api.post(`/users/bookmarks/${documentId}`, { note });
    return response.data.data.bookmark;
  },

  // Xóa bookmark
  async removeBookmark(documentId) {
    await api.delete(`/users/bookmarks/${documentId}`);
    return true;
  }
};
```

## 🔄 Update Frontend Components

### Document Upload Component
```javascript
// components/documents/DocumentUpload.tsx
import { documentService } from '@/lib/document-service';

const DocumentUpload = () => {
  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      const document = await documentService.uploadDocument(formData);
      
      // Show success message
      toast.success('Tài liệu đã được upload thành công!');
      
      // Refresh document list or redirect
      router.push(`/documents/${document.id}`);
    } catch (error) {
      toast.error(error.message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  // ... rest of component
};
```

### Document List Component
```javascript
// components/documents/DocumentGrid.tsx
import { documentService } from '@/lib/document-service';

const DocumentGrid = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async (params = {}) => {
    try {
      setLoading(true);
      const data = await documentService.getPublicDocuments(params);
      setDocuments(data.documents);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### Bookmark Component
```javascript
// components/documents/SaveDocumentButton.tsx
import { userService } from '@/lib/user-service';

const SaveDocumentButton = ({ documentId, isSaved: initialSaved }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    try {
      setLoading(true);
      
      if (isSaved) {
        await userService.removeBookmark(documentId);
        setIsSaved(false);
        toast.success('Đã xóa khỏi bookmark');
      } else {
        await userService.addBookmark(documentId);
        setIsSaved(true);
        toast.success('Đã thêm vào bookmark');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

## 🔧 Environment Configuration

### Update .env.local
```env
# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FILE_UPLOAD_MAX_SIZE=10485760
```

### Update next.config.ts
```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['localhost', 'your-backend-domain.com'],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/:path*`,
      },
    ];
  },
};
```

## 🧪 Testing Integration

### Test API Connection
```javascript
// utils/test-api.js
import api from '@/lib/api';

export const testApiConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Connection:', response.data);
    return true;
  } catch (error) {
    console.error('API Connection Failed:', error);
    return false;
  }
};
```

## 🚀 Deployment Notes

1. **Update API URL**: Thay đổi `NEXT_PUBLIC_API_URL` cho production
2. **CORS Configuration**: Đảm bảo backend CORS cho phép frontend domain
3. **File Serving**: Configure nginx/reverse proxy để serve uploaded files
4. **Error Handling**: Implement proper error boundaries và fallbacks

## 📝 Migration Checklist

- [ ] Replace all mock data services với real API calls
- [ ] Update authentication flow
- [ ] Implement file upload functionality  
- [ ] Update document management
- [ ] Implement user statistics
- [ ] Add bookmark functionality
- [ ] Test all API endpoints
- [ ] Handle error cases
- [ ] Update environment variables
- [ ] Test deployment configuration

Sau khi hoàn thành integration, frontend sẽ có đầy đủ chức năng backend thực tế thay vì dữ liệu mock.
