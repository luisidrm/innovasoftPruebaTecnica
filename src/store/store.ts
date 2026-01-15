import { configureStore } from "@reduxjs/toolkit";
import authReducer from "..features/auth/store/authSlice";
import clientesReducer from "./clientesSlice";
import interesesReducer from "./interesesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientes: clientesReducer,
    intereses: interesesReducer,
  },
});
