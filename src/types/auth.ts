export interface User {
  id: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  pictureUrl?: string;
  role: string;
  authProvider: string;
  createdAt: string;
}

export interface AuthResponse {
  authenticated: boolean;
  message: string;
  user?: User;
}
