import { useCallback, useState } from 'react';
import { apiService } from '../services/api';
import { Election, ElectionResult, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserResponse, VoteRequest, VoteResponse } from '../types/auth';

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
      // Stocker le token pour les futures requêtes
      authToken = response.token;
      console.log('Token stored after registration:', authToken);
      
      // Définir l'utilisateur courant avec les données de l'inscription
      const currentUser: UserResponse = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        gid: response.gid,
        password: response.password,
      };
      setCurrentUser(currentUser);
      
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

  const getElections = useCallback(async (token?: string): Promise<Election[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser le token stocké ou le token passé en paramètre
      const tokenToUse = token || authToken || undefined;
      console.log('Hook: getElections called with token:', tokenToUse ? 'YES' : 'NO');
      console.log('Hook: Stored token available:', authToken ? 'YES' : 'NO');
      
      const elections = await apiService.getElections(tokenToUse);
      console.log('Hook: Elections received in hook:', elections);
      console.log('Hook: Number of elections:', elections?.length || 0);
      
      return elections;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get elections';
      console.error('Hook: getElections error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getElectionResult = useCallback(async (electionId: string, token?: string): Promise<Election | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser le token stocké ou le token passé en paramètre
      const tokenToUse = token || authToken || undefined;
      console.log('Hook: getElectionResult called with electionId:', electionId);
      console.log('Hook: getElectionResult called with token:', tokenToUse ? 'YES' : 'NO');
      console.log('Hook: Stored token available:', authToken ? 'YES' : 'NO');
      
      const election = await apiService.getElectionResult(electionId, tokenToUse);
      console.log('Hook: Election result received in hook:', election);
      console.log('Hook: Election title:', election?.title);
      console.log('Hook: Election candidates count:', election?.candidates?.length || 0);
      
      return election;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get election result';
      console.error('Hook: getElectionResult error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = (): boolean => {
    return !!authToken;
  };

  const vote = useCallback(async (voteData: VoteRequest): Promise<VoteResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser le token stocké
      const tokenToUse = authToken || undefined;
      console.log('Hook: Submitting vote with token:', tokenToUse ? 'YES' : 'NO');
      console.log('Hook: Vote data:', voteData);
      
      const result = await apiService.vote(voteData, tokenToUse);
      console.log('Hook: Vote submitted successfully:', result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit vote';
      console.error('Hook: Vote error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getElectionResults = useCallback(async (electionId: string): Promise<ElectionResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser le token stocké
      const tokenToUse = authToken || undefined;
      console.log('Hook: Fetching election results with token:', tokenToUse ? 'YES' : 'NO');
      console.log('Hook: Election ID:', electionId);
      
      const result = await apiService.getElectionResults(electionId, tokenToUse);
      console.log('Hook: Election results fetched successfully:', result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch election results';
      console.error('Hook: Election results error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    register,
    login,
    getCurrentUser,
    getElections,
    getElectionResult,
    getElectionResults,
    vote,
    currentUser,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  };
};
