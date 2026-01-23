/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type Client, GENDER_OPTIONS,type Interest, type Gender } from "../../../shared/z.types";
import DateInput from "../components/DateInput";
import { useClients } from "../hooks/useClients"; import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/types";
import { useAppSelector } from "../../../store/hooks";
import type{ CreateClientBackendDTO } from "../api/clientsApi";

type ClientsFormRouteProp = RouteProp<RootStackParamList, "ClientsForm">;

export default function ClientFormScreen() {
  const route = useRoute<ClientsFormRouteProp>();
  const clientId = route.params?.clientId;
  const navigation = useNavigation();
  const usuarioId = useAppSelector((state) => state.auth.userid);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [form, setForm] = useState<Omit<CreateClientBackendDTO, "usuarioId">>({
    nombre: "",
    apellidos: "",
    identificacion: "",
    celular: "",
    otroTelefono: "",
    direccion: "",
    fNacimiento: "",
    fAfiliacion: "",
    sexo: "M",
    resennaPersonal: "",
    imagen: undefined,
    interesFK: "",
  });

  const { createClient, updateClient, getClientInfo, getInterests, loading } = useClients()

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const interestsData: Interest[] = await getInterests();
        setInterests(interestsData);
        console.log("Fetched interests:", interestsData);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    }
    const fetchClientData = async () => {
      if (!clientId) {
        return
      }
      try {
        const clientData: Client = await getClientInfo(clientId);
        setForm({
          identificacion: clientData.identificacion,
          nombre: clientData.nombre,
          apellidos: clientData.apellidos,
          direccion: clientData.direccion,
          fAfiliacion: clientData.fAfiliacion.toLocaleString(),
          fNacimiento: clientData.fNacimiento.toLocaleString(),
          sexo: clientData.sexo,
          imagen: clientData.imagen,
          resennaPersonal: clientData.resenaPersonal,
          otroTelefono: clientData.otroTelefono,
          celular: clientData.telefonoCelular,
          interesFK: clientData.interesesId
        });
        console.log("Fetched client data:", clientData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    }
    fetchInterests()
    fetchClientData()
    setBigLoading(false)
  }, [getClientInfo])



  const handleCreateOrUpdate = async () => {
    const payload = {
      ...form,
      fNacimiento: new Date(form.fNacimiento).toISOString(),
      fAfiliacion: new Date(form.fAfiliacion).toISOString(),
      usuarioId,
    };

    if (clientId) {
      await updateClient({ id: clientId, ...payload });
    } else {
      await createClient(payload);
    }

    navigation.navigate("Clients" as never);
  };
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Se necesita permiso para usar la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) return;

    const photo = result.assets[0];

    // Guardar base64 en el form
    update("imagen", photo.base64 || "");

    setShowCameraModal(false);
  };

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={80} // tweak if needed (header height)
  >
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Clients" as never)}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Mantenimiento de Clientes</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: form.imagen
              ? form.imagen.startsWith("data:image/") ? form.imagen : `data:image/jpeg;base64,${form.imagen}` 
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraBtn} onPress={() => setShowCameraModal(true)}>
          <Ionicons name="camera" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/** Inputs */}
      <Input label="Identificación *" value={form.identificacion} onChange={(v: string) => update("identificacion", v)} />
      <Input label="Nombre *" value={form.nombre} onChange={(v: string) => update("nombre", v)} />
      <Input label="Apellidos *" value={form.apellidos} onChange={(v: string) => update("apellidos", v)} />

      {/* Gender */}
      <Select
        label="Género *"
        value={form.sexo}
        options={GENDER_OPTIONS}
        onChange={(v: Gender) => update("sexo", v)}
      />

      <DateInput
        label="Fecha Nacimiento *"
        value={form.fNacimiento.toString().split("T")[0]}
        onChange={(v: string) => update("fNacimiento", v)}
      />
      <DateInput
        label="Fecha de Afiliación *"
        value={form.fAfiliacion.toString().split("T")[0]}
        onChange={(v: string) => update("fAfiliacion", v)}
      />
      <Input label="Celular *" value={form.celular} onChange={(v: string) => update("celular", v)} keyboardType="phone-pad" />
      <Input label="Teléfono" value={form.otroTelefono} onChange={(v: string) => update("otroTelefono", v)} keyboardType="phone-pad" />

      {/* Interests */}
      <Select
        label="Interés *"
        value={interests.find(p => p.id === form.interesFK)?.descripcion || interests[0]}
        options={interests.map((i) => i.descripcion)}
        onChange={(v: string) => {
          const selectedInterest = interests.find(i => i.descripcion === v);
          if (selectedInterest) {
            update("interesFK", selectedInterest.id);
            return;
          }
        }}
      />

      <TextArea label="Dirección *" value={form.direccion} onChange={(v: string) => update("direccion", v)} />
      <TextArea label="Reseña *" value={form.resennaPersonal} onChange={(v: string) => update("resennaPersonal", v)} />

      <View style={styles.buttonsRow}>

        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.saveText}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={() => handleCreateOrUpdate()}>
          {loading ? <ActivityIndicator color={"white"} /> : <Text style={styles.saveText}>Guardar</Text>}
        </TouchableOpacity>
      </View>

      <Modal visible={showCameraModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCameraModal(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Agregar foto</Text>

            <TouchableOpacity style={styles.modalBtn} onPress={takePhoto}>
              <Text style={styles.modalBtnText}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#9ca3af" }]}
              onPress={() => setShowCameraModal(false)}
            >
              <Text style={styles.modalBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
        </ScrollView>
  </KeyboardAvoidingView>
);
}

/* ---------------- UI Pieces ---------------- */

function Input({ label, value, onChange, keyboardType }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

function TextArea({ label, value, onChange }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[styles.input, styles.textArea]}
        multiline
      />
    </View>
  );
}

function Select({ label, value, options, onChange }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.select}>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.selectItem,
              value === opt && styles.selectActive,
            ]}
            onPress={() => onChange(opt)}
          >
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 12 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "600", marginLeft: 12 },

  avatarContainer: { alignItems: "center", marginVertical: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#14b8a6",
    padding: 8,
    borderRadius: 20,
  },

  field: { marginBottom: 12 },
  label: { color: "#6b7280", marginBottom: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  textArea: { height: 80, textAlignVertical: "top" },

  select: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectItem: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  selectActive: {
    backgroundColor: "#e0f2fe",
    borderColor: "#38bdf8",
  },
  deleteBtn: {
    marginVertical: 20,
    backgroundColor: "red",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },
  saveBtn: {
    marginVertical: 20,
    backgroundColor: "darkblue",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },
  saveText: { color: "white", fontSize: 16, fontWeight: "600" },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: "#14b8a6",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  modalBtnText: {
    color: "white",
    fontWeight: "600",
  },

});
