'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { getUserIdFromToken, decodeToken } from '@/lib/utils';
import { UserInfo, ApiResponse } from '@/types/auth';

interface UserContextType {
  user: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 토큰에서 사용자 ID 추출
  useEffect(() => {
  const checkToken = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setUserId(null);
      queryClient.removeQueries({ queryKey: ['userInfo'] });
      return;
    }

    const decoded = decodeToken(token);
    const now = Math.floor(Date.now() / 1000);

    if (!decoded || !decoded.exp || decoded.exp < now) {
      console.log('[UserContext] Token expired → clearing...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUserId(null);
      queryClient.removeQueries({ queryKey: ['userInfo'] });
      return;
    }

    const extractedUserId = getUserIdFromToken();
    setUserId(extractedUserId);
  };

  checkToken();

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'accessToken') {
      checkToken();
    }
  };

  const handleTokenChange = () => {
    checkToken();
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('tokenChange', handleTokenChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('tokenChange', handleTokenChange);
  };
}, [queryClient]);


  // 사용자 정보 조회
  const {
    data: userInfoResponse,
    isLoading,
    error,
    refetch
  } = useQuery<ApiResponse<UserInfo>>({
    queryKey: ['userInfo', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('사용자 ID가 없습니다.');
      }
      console.log('[UserContext] Fetching user info for userId:', userId);
      const response = await axiosInstance.get(`/api/users/${userId}`);
      console.log('[UserContext] User info received:', response.data);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });

  // isAuthenticated: 토큰이 있으면 인증된 것으로 간주
  const isAuthenticated = !!userId;

  const value: UserContextType = {
    user: userInfoResponse?.data || null,
    isLoading,
    error: error as Error | null,
    refetch,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 