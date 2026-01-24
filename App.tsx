import { Provider } from "react-redux";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { ErrorProvider} from "./src/shared/ErrorContext";

export default function App() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <ErrorProvider>
          <AppNavigator />
        </ErrorProvider>
      </Provider>
    </PaperProvider>
  );
}
