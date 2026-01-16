import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  Snackbar,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

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
      navigation.replace("Home");
    }
  }, [token]);

  const handleLogin = async () => {
    if (!username || !password) {
      setVisible(true);
      return;
    }

    if (remember) {
      await AsyncStorage.setItem("rememberUser", username);
    } else {
      await AsyncStorage.removeItem("rememberUser");
    }

    dispatch(loginUser({ username, password }));
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text variant="headlineMedium" style={styles.title}>
        ¡Bienvenido!
      </Text>

      <TextInput
        label="Usuario *"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Contraseña *"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
        style={styles.input}
      />

      <View style={styles.row}>
        <Checkbox
          status={remember ? "checked" : "unchecked"}
          onPress={() => setRemember(!remember)}
        />
        <Text>Recordarme</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        INICIAR SESIÓN
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Register")}
        style={styles.link}
      >
        ¿No tiene una cuenta? Regístrese
      </Button>

      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {error || "Usuario y contraseña son obligatorios"}
      </Snackbar>
    </View>
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
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  link: {
    marginTop: 12,
  },
});
