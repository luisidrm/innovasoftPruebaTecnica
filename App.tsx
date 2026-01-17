import { Provider } from "react-redux";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { ErrorProvider, useError } from "./src/shared/ErrorContext";
import ErrorScreen from "./src/features/ErrorScreen";

function AppContent() {
  const { message, clearError } = useError();

  if (message) {
    return <ErrorScreen message={message} onRetry={clearError} />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <ErrorProvider>
          <AppContent />
        </ErrorProvider>
      </Provider>
    </PaperProvider>
  );
}
