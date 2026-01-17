import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  loginUser,
  registerUser,
  logoutUser,
  restoreSession,
  clearError,
} from '../store/authSlice';
import type{ LoginRequest, RegisterRequest } from '../types/auth.schemas';
import { useNavigation } from '@react-navigation/native';


export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const {
    token,
    userid,
    username,
    expiration,
    loading,
    error,
  } = useAppSelector((state) => state.auth);

  const [registerSuccess, setRegisterSuccess] = useState<boolean|null>(null)

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginUser(credentials));
      return result;
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const result = await dispatch(registerUser(data));
      setRegisterSuccess(result.meta.requestStatus==="fulfilled" || false);
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(
    () => {
      dispatch(logoutUser()).then(() =>{
        navigation.navigate("Login" as never);
      })
    },
    [dispatch, navigation]
  );

  const clearAuthError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  // const clearRegister = useCallback(
  //   () => dispatch(clearRegisterState()),
  //   [dispatch]
  // );

  const isAuthenticated = !!token;

  return {
    token,
    userid,
    username,
    expiration,
    loading,
    error,
    registerSuccess,
    isAuthenticated,
    login,
    register,
    logout,
    clearError: clearAuthError,
  };
};