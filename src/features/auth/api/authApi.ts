import { api } from '../../../services/axiosConfig';
import type { LoginCredentials, User } from '../types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials) => 
    api.post<User>('/auth/login', credentials),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getProfile: () => 
    api.get<User>('/auth/profile')
};