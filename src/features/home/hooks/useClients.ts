import { useCallback, useState } from "react";
import { clientsApi, type CreateClientBackendDTO } from "../api/clientsApi";
import { type Interest, InterestSchema, Client } from "../../../shared/z.types";
import { showGlobalError } from '../../../utils/ErrorBridge';
import { useError } from "../../../shared/ErrorContext";

export function useClients() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {showError} = useError();

    const createClient = async (
        client: CreateClientBackendDTO,
    ): Promise<any> => {
        try {
            setLoading(true);
            setError(null);
            const response = await clientsApi.create(client);
            return response;
        } catch (err: any) {
            const errorMsg = err?.message || "Error creating client";
            setError(errorMsg);
            showError(errorMsg); // ✅ Ya lo tienes
        } finally {
            setLoading(false);
        }
    };

    const listClients = async (params: {
        usuarioId: string;
        identificacion?: string;
        nombre?: string;
    }): Promise<Client[]> => {
        try {
            setLoading(true);
            setError(null);
            const response = await clientsApi.list(params);
            return response;
        } catch (err: any) {
            const errorMsg = err?.message || "Error loading clients";
            setError(errorMsg);
            showError(errorMsg); // ⬅️ Agregar aquí
        } finally {
            setLoading(false);
        }
    };

    const updateClient = async (
        client: CreateClientBackendDTO & { id: string },
    ): Promise<any> => {
        try {
            setLoading(true);
            setError(null);
            const response = await clientsApi.update(client);
            return response.data;
        } catch (err: any) {
            const errorMsg = err?.message || "Error updating client";
            setError(errorMsg);
            showError(errorMsg); // ⬅️ Agregar aquí
        } finally {
            setLoading(false);
        }
    };

    const getClientInfo = useCallback(
        async (clientId: string): Promise<Client> => {
            try {
                setLoading(true);
                setError(null);
                const client = await clientsApi.getInfo(clientId);
                return client;
            } catch (err: any) {
                const errorMsg = err?.message || "Error fetching client info";
                setError(errorMsg);
                showError(errorMsg); // ⬅️ Agregar aquí
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getInterests = useCallback(async (): Promise<Interest[]> => {
        try {
            setLoading(true);
            setError(null);
            const interests = await clientsApi.getIntereses();
            return interests.map((i) => InterestSchema.parse(i));
        } catch (err: any) {
            const errorMsg = err?.message || "Error fetching interests";
            setError(errorMsg);
            showError(errorMsg); // ⬅️ Agregar aquí
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