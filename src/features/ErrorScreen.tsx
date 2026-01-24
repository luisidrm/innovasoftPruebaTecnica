/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";

type ErrorScreenRouteProp = RouteProp<RootStackParamList, 'ErrorScreen'>;

export default function ErrorScreen() {
    const navigation = useNavigation();
    const route = useRoute<ErrorScreenRouteProp>();
    const { message, onRetry } = route.params;

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
        navigation.goBack();
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Ionicons name="alert-circle" size={64} color="red" style={{ marginBottom: 20 }} />
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
                Ocurrió un error
            </Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
                {message}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>

                {onRetry && (
                    <TouchableOpacity
                        onPress={handleRetry}
                        style={{
                            backgroundColor: "#111827",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 8,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: "white" }}>Reintentar</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleCancel}
                    style={{
                        backgroundColor: "red",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                >
                    <Text style={{ color: "white" }}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}