import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  View
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequestSchema } from '../types/auth.schemas';
import { useNavigation } from '@react-navigation/native';


export const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validationErrors, setValidationErrors] = useState<Record<string,string>>({});
  const { register, loading, error, registerSuccess } = useAuth();

  const navigation = useNavigation();

  useEffect(() => {
    if (registerSuccess) {
      Alert.alert(
        'Success',
        "Registration successful! Please log in.",
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login' as never);
            }
          }
        ]
      );
    }
  }, [registerSuccess, navigation]);


  const handleSubmit = async () => {
    setValidationErrors({});
    // Validate with Zod
    const result = RegisterRequestSchema.safeParse({
      username, 
      email,
      password
    });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.map((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });

      setValidationErrors(errors);
      return;
    }
    await register(result.data).then(()=>{
      navigation.navigate("Login" as never)
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={[styles.input, validationErrors.username &&
          styles.inputError]}
        value={username}
        onChangeText={setUsername}
        label="Nombre de usuario *"
        mode='outlined'
        autoCapitalize="none"
        textColor='black'
        outlineColor='blue'
        activeOutlineColor='blue'
      />
      {validationErrors.username && (
        <Text style={styles.errorText}>{validationErrors.username}</Text>
      )}
      <TextInput
        style={[styles.input, validationErrors.email &&
          styles.inputError]}
        value={email}
        onChangeText={setEmail}
        label="Correo electrónico *"
        mode='outlined'
        keyboardType="email-address"
        autoCapitalize="none"
        textColor='black'
        outlineColor='blue'
        activeOutlineColor='blue'
      />
      {validationErrors.email && (
        <Text style={styles.errorText}>{validationErrors.email}</Text>
      )}
      <TextInput
        style={[styles.input, validationErrors.password &&
          styles.inputError]}
        value={password}
        onChangeText={setPassword}
        label="Contraseña *"
        mode='outlined'
        secureTextEntry
        autoCapitalize="none"
        textColor='black'
        outlineColor='blue'
        activeOutlineColor='blue'
      />
      {validationErrors.password && (
        <Text style={styles.errorText}>{validationErrors.password}</Text>
      )}
      <Text style={styles.passwordHint}>
        Password must be 8-20 characters with at least one uppercase, one
        lowercase, and one number.
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View>

        <Button
          title={loading ? 'Loading...' : 'REGISTER'}
          onPress={handleSubmit}
          disabled={loading}
        />
        {loading && <ActivityIndicator style={styles.loader} />}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Login' as never)}
        >
          Already have an account? Login
        </Text>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    marginLeft: 5
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  loader: {
    marginTop: 10
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20
  },
  button: {
    marginTop: 8,
    backgroundColor: "blue",
    color: "white"
  },
});