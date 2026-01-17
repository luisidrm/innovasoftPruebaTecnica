export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Clients: undefined;
  ClientsForm: { clientId?: string }; // opcional: para crear o editar
  ErrorScreen: { message: string , onRetry?: () => void};
};