import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/authApi';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.schemas';


export interface AuthState {
  token: string | null;
  userid: string | null;
  username: string | null;
  expiration: string | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  token: null,
  userid: null,
  username: null,
  expiration: null,
  loading: false,
  error: null
};
// Async thunk for login
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      // Store token and user info
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        userid: response.userid,
        username: response.username,
        expiration: response.expiration
      }));
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async ({username, email, password}, {rejectWithValue}) => {
    try {
      const response = await authApi.register({username, email, password});
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);
// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await authApi.logout();
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }
);
// Async thunk to restore session from storage
export const restoreSession = createAsyncThunk<
  LoginResponse | null,
  void,
  { rejectValue: string }
>(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (!token || !userStr) {
        return null;
      }
      const user = JSON.parse(userStr);
      // Check if token is expired
      const expiration = new Date(user.expiration);
      if (expiration < new Date()) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        return null;
      }
      return {
        token,
        ...user
      };
    } catch (error) {
      return rejectWithValue('Failed to restore session');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action:
        PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userid = action.payload.userid;
        state.username = action.payload.username;
        state.expiration = action.payload.expiration;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.userid = null;
        state.username = null;
        state.expiration = null;
        state.error = null;
      })
      // Restore session
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.userid = action.payload.userid;
          state.username = action.payload.username;
          state.expiration = action.payload.expiration;
        }
      });
  }
});
export const { clearError } = authSlice.actions;
export default authSlice.reducer