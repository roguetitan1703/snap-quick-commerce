import { useState, useEffect } from 'react';
import { authApi, ApiResponse, LoginResponse } from '@/utils/api';

interface User {
  userId: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthResult extends AuthState {
  login: (email: string, password: string) => Promise<ApiResponse<LoginResponse>>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthResult {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    console.log("Initializing auth state from localStorage");
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        console.log("Found stored credentials, setting authenticated state", { user });
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        // Invalid user JSON
        console.error("Error parsing stored user JSON:", e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      console.log("No stored credentials found");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        // Store user data in state
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed',
        }));
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.register(username, password, email);
      
      if (response.success && response.data) {
        const loginResponse = response.data as LoginResponse;
        // Store user data in state and localStorage
        localStorage.setItem('auth_token', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        
        setAuthState({
          user: loginResponse.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
        }));
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
  };
} 