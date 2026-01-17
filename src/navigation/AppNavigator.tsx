import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../features/auth/screens/RegisterScreen";
import HomeScreen from "../features/home/screens/HomeScreen";
import ClientsScreen from "../features/home/screens/ClientsScreen";
import ClientsFormScreen from "../features/home/screens/ClientsFormScreen";
import type{ RootStackParamList } from "./types";
import ErrorScreen from "../features/ErrorScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Clients" component={ClientsScreen} />
        <Stack.Screen name="ClientsForm" component={ClientsFormScreen} />
        <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
