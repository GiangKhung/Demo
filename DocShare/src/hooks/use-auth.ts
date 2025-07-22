"use client";

import { useContext } from 'react';
import { AuthContext } from '@/providers/auth-provider';

// Hook này chỉ là một wrapper để re-export context từ auth-provider
export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
