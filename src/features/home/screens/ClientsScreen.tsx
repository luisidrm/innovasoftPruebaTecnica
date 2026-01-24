/* eslint-disable react-native/no-inline-styles */
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import SegmentSelector from "../components/SegmentSelector";
import { useClients } from "../hooks/useClients";
import { useEffect, useState } from "react";
import ClientItem from "../components/ClientItem";
import { useError } from "../../../shared/ErrorContext";

interface Client {
  id: string;
  identificacion: string;
  nombre: string;
  apellidos: string;
}

export default function ClientsScreen() {
  const { logout, userid } = useAuth();
  const navigation = useNavigation();
  const { message, clearError } = useError();

  const { loading, error, listClients } = useClients();

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"Nombre" | "Identificación">("Nombre");
  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    try {
      const params =
        mode === "Nombre"
          ? { usuarioId: userid, nombre: search }
          : { usuarioId: userid, identificacion: search };

      const data = await listClients(params);
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setClients([]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, mode]);

  // Si hay error global, mostrar ErrorScreen
  useEffect(() => {
    if (message) {
      navigation.navigate("ErrorScreen", {
        message,
        onRetry: () => {
          clearError();
          fetchClients();
        },
      } as never);
    }
  }, [message, clearError, navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate("Home" as never)}>
          <Ionicons name="home-outline" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.username}>Consulta de Clientes</Text>
        <TouchableOpacity onPress={() => logout()}>
          <MaterialIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("ClientsForm" as never)}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.buttonText}>Nuevo Cliente</Text>
      </Button>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cliente..."
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
      />

      <SegmentSelector onChange={(v) => setMode(v)} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}

      {!loading && !error && clients.length === 0 &&
        <>
          <Ionicons name="search-circle-outline" size={64} color="#9ca3af" style={{ alignSelf: "center", marginTop: 40 }} />
          <Text style={{ textAlign: "center", marginTop: 10 }}>No se encontraron clientes.</Text>
        </>}

      {clients.length > 0 && <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClientItem
            name={`${item.nombre} ${item.apellidos}`}
            phone={item.identificacion}
            onPress={() =>
              navigation.navigate("ClientsForm", {
                clientId: item.id,
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  searchInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
  },
  button: {
    marginTop: 8,
    backgroundColor: "blue",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 20,
  },
});