export interface RegisterRequest {
  firstName: string;
  lastName: string;
  gid: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  firstName: string;
  lastName: string;
  gid: string;
  createdAt: string;
}

export interface LoginRequest {
  gid: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    gid: string;
  };
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  gid: string;
  password: null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface Candidate {
  gid: string;
  description: string;
}

export interface Election {
  id: string;
  createdAt: string;
  title: string;
  startAt: string;
  endAt: string;
  candidates: Candidate[];
}

export interface ElectionsResponse {
  elections: Election[];
}

// La réponse API est un tableau direct d'élections
export type ElectionsApiResponse = Election[];

// Types pour l'API de vote
export interface VoteRequest {
  electionId: string;
  candidateId: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  voteId?: string;
}

// Types pour les résultats d'élection
export interface ElectionCandidateResult {
  candidateGid: string;
  voteAmount: number;
}

export interface ElectionResult {
  electionId: string;
  totalVote: number;
  candidateResults: ElectionCandidateResult[];
}
