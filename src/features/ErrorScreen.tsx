/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorScreen({ message, onRetry }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Ocurrió un error
      </Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: "#111827",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Reintentar</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onRetry}
        style={{
          backgroundColor: "red",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white" }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}
