import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  Snackbar,
} from "react-native-paper";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScreenContainer } from "react-native-screens";
import { useAuth } from "../hooks/useAuth";
import { LoginRequestSchema } from "../types/auth.schemas";

export default function LoginScreen() {
  const navigation = useNavigation()
  const { token } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [validationError, setValidationError] = useState<string | null>(null);

  const [remember, setRemember] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const { login, loading, error } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("rememberUser");
      if (savedUser) {
        setUsername(savedUser);
        setRemember(true);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (error) setVisible(true);
  }, [error]);

  useEffect(() => {
    if (token) {
      navigation.navigate("Home" as never);
    }
  }, [token]);

  const handleLogin = async () => {
    setValidationError(null);
    if (!username || !password) {
      setVisible(true);
      return;
    }

    if (remember) {
      await AsyncStorage.setItem("rememberUser", username);
      await AsyncStorage.setItem("rememberPass", password);
    } else {
      await AsyncStorage.removeItem("rememberUser");
      await AsyncStorage.removeItem("rememberPass");

    }

    const result = LoginRequestSchema.safeParse({ username, password });

    if (!result.success) {
      const firstError = result.error.message;
      setValidationError(firstError || 'Validation error');
      return;
    }

    login({ username, password });
  };

  return (
    <ScreenContainer
      style={styles.container}>
      {/* Logo */}
      {/* <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      /> */}

      <Text variant="headlineMedium" style={styles.title}>
        ¡Bienvenido!
      </Text>

      <TextInput
        label="Usuario *"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        outlineColor="gray"
        activeOutlineColor="blue"
        style={styles.input}
        textColor="#000"
        placeholderTextColor="#000"
        theme={{
          colors: {
            background: '#fff',
          },
        }}
      />

      <TextInput
        label="Contraseña *"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        outlineColor="gray"
        activeOutlineColor="blue"
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
        style={styles.input}
        textColor="#000"
        theme={{
          colors: {
            background: '#fff',
          },
        }}
      />

      <View style={styles.row}>
        <Checkbox
          color="blue"
          uncheckedColor="black"
          status={remember ? "checked" : "unchecked"}
          onPress={() => setRemember(!remember)}
        />
        <Text style={{ color: "#000" }}>Recordarme</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
        textColor="white"
        disabled={loading}
      >
        {"INICIAR SESIÓN"}
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Register")}
        style={styles.link}
        textColor="blue"
      >
        ¿No tiene una cuenta? Regístrese
      </Button>

      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {error|| validationError || "Usuario y contraseña son obligatorios"}
      </Snackbar>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: "blue",
    color: "white"
  },
  link: {
    marginTop: 12,
    color: "blue"
  },
  snackBar: {
    color: "black"
  }
});
