// Định nghĩa các kiểu dữ liệu liên quan đến xác thực

import { ReactNode, FormEvent } from 'react';

// Kiểu dữ liệu cho form xác thực
export interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

// Kiểu dữ liệu cho thông tin đăng nhập
export interface SignInCredentials {
  email: string;
  password: string;
}

// Kiểu dữ liệu cho thông tin đăng ký
export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

// Kiểu dữ liệu cho kết quả xác thực
export interface AuthResult {
  success: boolean;
  message?: string;
  user?: any;
}

// Kiểu dữ liệu cho trạng thái xác thực
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

// Kiểu dữ liệu cho thông tin phiên làm việc
export interface Session {
  user: any;
  expires: string;
}
