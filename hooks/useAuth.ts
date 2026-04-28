import { useState } from 'react';
import { apiService } from '@/services/api';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: RegisterRequest): Promise<RegisterResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.register(userData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(credentials);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    register,
    login,
    isLoading,
    error,
    clearError,
  };
};
