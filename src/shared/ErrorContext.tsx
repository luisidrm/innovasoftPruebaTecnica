import type React from "react";
import { createContext, useContext, useState } from "react";

interface ErrorState {
  message: string | null;
  showError: (msg: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorState | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showError = (msg: string) => setMessage(msg);
  const clearError = () => setMessage(null);

  return (
    <ErrorContext.Provider value={{ message, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useError must be used inside ErrorProvider");
  return ctx;
}
