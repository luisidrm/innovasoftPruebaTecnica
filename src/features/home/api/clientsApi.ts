import { api } from "../../../services/axiosConfig";
import { type Client, type ClientResponse, ClientResponseSchema, ClientSchema, type ClientsListResponse, ClientsListResponseSchema, Interest } from "../../../shared/z.types";

interface GetClientsParams {
  identificacion?: string
  nombre?: string
  usuarioId: string
}

interface CreateClientResponse {
  status: string;
  message: string;
}

export type CreateClientBackendDTO = {
  nombre: string;
  apellidos: string;
  identificacion: string;
  celular: string;
  otroTelefono?: string;
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  sexo: string;
  resennaPersonal: string;
  imagen?: string;
  interesFK: string;
  usuarioId: string;
};

export const clientsApi = {
  create: async (newClient: CreateClientBackendDTO): Promise<CreateClientResponse> => {
    const response = await api.post<CreateClientResponse>(
      '/api/Cliente/Crear',
      newClient
    );
    return response.data;
  },
  list: async (getClients: GetClientsParams): Promise<{ id: string, identificacion: string, nombre: string, apellidos: string }[]> => {
    const response = await api.post<{ id: string, identificacion: string, nombre: string, apellidos: string }[]>(
      "/api/Cliente/Listado",
      getClients
    )
    return response.data
  },
  update: async (updatedClient: CreateClientBackendDTO&{id: string}): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>(
      '/api/Cliente/Actualizar',
      updatedClient
    );
    return response.data
  },
  getIntereses: async (): Promise<Interest[]> => {
    const response = await api.get<Interest[]>(
      '/api/Intereses/Listado'
    );
    return response.data;
  },
  getInfo: async (clientId: string): Promise<Client> => {
    const response = await api.get<ClientResponse>(
      `/api/Cliente/Obtener/${clientId}`,

    );
    const parsed = ClientSchema.parse(response.data);
    return parsed;
  }
}