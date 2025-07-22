import api from './api';
import { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  error?: string;
}

export const authService = {
  // Đăng ký người dùng mới
  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Lưu token và user info vào localStorage
        localStorage.setItem('docshare_token', token);
        localStorage.setItem('docshare_user', JSON.stringify(user));
        
        return user;
      }
      
      throw new Error(response.data.error || 'Đăng ký thất bại');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Đăng ký thất bại';
      throw new Error(message);
    }
  },

  // Đăng nhập
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Lưu token và user info vào localStorage
        localStorage.setItem('docshare_token', token);
        localStorage.setItem('docshare_user', JSON.stringify(user));
        
        return user;
      }
      
      throw new Error(response.data.error || 'Đăng nhập thất bại');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Đăng nhập thất bại';
      throw new Error(message);
    }
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('docshare_token');
      if (!token) {
        return null;
      }

      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('docshare_user', JSON.stringify(user));
        return user;
      }
      
      return null;
    } catch (error) {
      // Nếu token không hợp lệ, xóa khỏi localStorage
      localStorage.removeItem('docshare_token');
      localStorage.removeItem('docshare_user');
      return null;
    }
  },

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      // Xóa token và user info khỏi localStorage
      localStorage.removeItem('docshare_token');
      localStorage.removeItem('docshare_user');
      
      // Redirect về trang chủ
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<{ success: boolean; data: { user: User } }>('/auth/updatedetails', userData);
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('docshare_user', JSON.stringify(user));
        return user;
      }
      
      throw new Error('Cập nhật thất bại');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Cập nhật thất bại';
      throw new Error(message);
    }
  },

  // Đổi mật khẩu
  async changePassword(passwordData: PasswordChangeData): Promise<boolean> {
    try {
      const response = await api.put<{ success: boolean; data: { token: string } }>('/auth/updatepassword', passwordData);
      
      if (response.data.success) {
        // Cập nhật token mới
        const { token } = response.data.data;
        localStorage.setItem('docshare_token', token);
        return true;
      }
      
      throw new Error('Đổi mật khẩu thất bại');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Đổi mật khẩu thất bại';
      throw new Error(message);
    }
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('docshare_token');
  },

  // Lấy token hiện tại
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('docshare_token');
  },

  // Lấy user từ localStorage
  getUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('docshare_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }
};

export default authService;
