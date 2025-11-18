import api from './api';
import type { LoginModel, LoginResponse } from '../types';

export const authService = {
  async login(credentials: LoginModel): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/Auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

