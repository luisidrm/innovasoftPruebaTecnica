import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginRequest, LoginResponse } from "../types/auth.schemas";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from "../api/authApi";
import { RegisterRequest, RegisterResponse } from "../types/auth.schemas";

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
    // await authApi.logout();
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