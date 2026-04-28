import { ApiError, Election, ElectionResult, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserResponse, VoteRequest, VoteResponse } from '../types/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://fidio-api-dev.onrender.com';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(token?: string): Promise<UserResponse> {
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request<UserResponse>('/auth/me', {
      method: 'GET',
      headers,
    });
  }

  async getElections(token?: string): Promise<Election[]> {
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API: Fetching elections from /elections');
    console.log('API: Using token:', token ? 'YES' : 'NO');
    
    try {
      const result = await this.request<Election[]>('/elections', {
        method: 'GET',
        headers,
      });
      console.log('API: Elections fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('API: Failed to fetch elections:', error);
      throw error;
    }
  }

  async getElectionResult(electionId: string, token?: string): Promise<Election> {
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request<Election>(`/elections/${electionId}/result`, {
      method: 'GET',
      headers,
    });
  }

  async vote(voteData: VoteRequest, token?: string): Promise<VoteResponse> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API: Submitting vote for election:', voteData.electionId);
    console.log('API: Candidate ID:', voteData.candidateId);
    
    // L'API attend un tableau d'objets de vote
    const voteArray = [voteData];
    console.log('API: Sending vote array:', voteArray);
    
    try {
      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(voteArray),
      });
      
      console.log('API: Vote response status:', response.status);
      console.log('API: Vote response ok:', response.ok);
      
      if (response.ok) {
        // Pour une réponse 201 Created sans corps, retourner un succès par défaut
        if (response.status === 201) {
          const successResponse: VoteResponse = {
            success: true,
            message: 'Vote created successfully',
            voteId: 'generated'
          };
          console.log('API: Vote submitted successfully (201 Created):', successResponse);
          return successResponse;
        }
        
        // Essayer de parser la réponse si elle a un contenu
        const text = await response.text();
        console.log('API: Vote response text:', text);
        
        if (text) {
          try {
            const result = JSON.parse(text) as VoteResponse;
            console.log('API: Vote submitted successfully:', result);
            return result;
          } catch (parseError) {
            console.log('API: Response is not JSON, treating as success');
            return {
              success: true,
              message: 'Vote submitted successfully',
              voteId: 'generated'
            };
          }
        } else {
          // Réponse vide mais succès
          const successResponse: VoteResponse = {
            success: true,
            message: 'Vote submitted successfully',
            voteId: 'generated'
          };
          console.log('API: Vote submitted successfully (empty response):', successResponse);
          return successResponse;
        }
      } else {
        // Gérer les erreurs HTTP
        const errorText = await response.text();
        console.error('API: Vote failed with status:', response.status);
        console.error('API: Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    } catch (error) {
      console.error('API: Failed to submit vote:', error);
      throw error;
    }
  }

  async getElectionResults(electionId: string, token?: string): Promise<ElectionResult> {
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API: Fetching election results for ID:', electionId);
    
    try {
      const result = await this.request<ElectionResult>(`/elections/${electionId}/result`, {
        method: 'GET',
        headers,
      });
      console.log('API: Election results fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('API: Failed to fetch election results:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiService = new ApiService();
