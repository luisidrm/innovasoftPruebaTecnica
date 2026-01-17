import { useCallback, useState } from "react";
import { clientsApi,type CreateClientBackendDTO } from "../api/clientsApi"; // ajusta ruta
import {
  type Interest,
  InterestSchema,
} from "../../../shared/z.types";

export function useClients() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear cliente
  const createClient = async (client: CreateClientBackendDTO): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.create(client);
      // Aquí podrías parsear con Zod si tu API devuelve el cliente creado
      return response;
    } catch (err: any) {
      setError(err?.message || "Error creating client");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listar clientes
  const listClients = async (params: { usuarioId: string; identificacion?: string; nombre?: string }): Promise<Client[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.list(params);
      // Parseamos con Zod usando ClientsListResponseSchema si tu API devolviera esa estructura
      return response;
    } catch (err: any) {
      setError(err?.message || "Error loading clients");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cliente
  const updateClient = async (client: CreateClientBackendDTO & { id: string }): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.update(client);
      return response.data; // parseado con ClientResponseSchema ya en api
    } catch (err: any) {
      setError(err?.message || "Error updating client");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener información de un cliente
  const getClientInfo = useCallback(async (clientId: string): Promise<Client> => {
    try {
      setLoading(true);
      setError(null);
      const client = await clientsApi.getInfo(clientId);
      return client; // ya parseado con ClientResponseSchema
    } catch (err: any) {
      setError(err?.message || "Error fetching client info");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener lista de intereses
  const getInterests = useCallback(async (): Promise<Interest[]> => {
    try {
      setLoading(true);
      setError(null);
      const interests = await clientsApi.getIntereses();
      // Parseamos cada interés con InterestSchema
      return interests.map(i => InterestSchema.parse(i));
    } catch (err: any) {
      setError(err?.message || "Error fetching interests");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createClient,
    listClients,
    updateClient,
    getClientInfo,
    getInterests,
  };
}
