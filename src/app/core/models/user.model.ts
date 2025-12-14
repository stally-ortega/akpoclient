/**
 * Represents the authenticated user.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

/**
 * Represents the response from the login webhook.
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Standard API Error response structure.
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
