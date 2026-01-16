import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import type { AuthState, LoginCredentials, User } from '../types/auth.types';

export const loginUser = createAsyncThunk<
  User,                    // Return type
  LoginCredentials,        // Argument type
  { rejectValue: string }  // ThunkAPI config
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
    },
    loginCompleted: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
});

export const { clearError, logout, loginCompleted } = authSlice.actions;
export default authSlice.reducer;