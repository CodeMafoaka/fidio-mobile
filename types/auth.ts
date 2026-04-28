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

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
