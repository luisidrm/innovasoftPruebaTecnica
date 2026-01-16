import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser, logout, clearError } from '../store/authSlice';
import type{ LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const handleLogout = useCallback(
    () => dispatch(logout()),
    [dispatch]
  );

  const clearAuthError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  return {
    user,
    loading,
    error,
    login,
    logout: handleLogout,
    clearError: clearAuthError
  };
};