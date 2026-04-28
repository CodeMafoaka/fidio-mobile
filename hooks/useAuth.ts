import { useCallback, useState } from 'react';
import { apiService } from '../services/api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserResponse } from '../types/auth';

// Stockage simple du token en mémoire
let authToken: string | null = null;

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

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
      // Stocker le token pour les futures requêtes
      authToken = response.token;
      console.log('Token stored:', authToken);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = useCallback(async (token?: string): Promise<UserResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser le token stocké ou le token passé en paramètre
      const tokenToUse = token || authToken || undefined;
      const user = await apiService.getCurrentUser(tokenToUse);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user info';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    register,
    login,
    getCurrentUser,
    currentUser,
    isLoading,
    error,
    clearError,
  };
};
