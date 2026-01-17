import { api } from '../../../services/axiosConfig';
import {
  type LoginRequest,
  type LoginResponse,
  LoginResponseSchema,
  type RegisterRequest,
  type RegisterResponse,
  RegisterResponseSchema
} from '../types/auth.schemas';
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      '/api/Authenticate/login',
      credentials
    );

    const validatedData = LoginResponseSchema.parse(response.data);
    return validatedData;
  },
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      '/api/Authenticate/register',
      data
    );

    const validatedData = RegisterResponseSchema.parse(response.data);
    return validatedData;
  },
  // logout: async (): Promise<void> => {
  //   // Call logout endpoint if it exists
  //   const response = await api.post(
  //     '/api/Authenticate/logout',
  //   );
  //   return response.data;
  // }
};