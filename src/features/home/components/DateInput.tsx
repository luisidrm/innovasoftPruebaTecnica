/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export function DateInput({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: "#6b7280", marginBottom: 4 }}>{label}</Text>

      {/* WEB */}
      {Platform.OS === "web" ? (
        <TextInput
          type="date"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 10,
            borderWidth: 1,
            borderColor: "#d1d5db",
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 10,
              borderWidth: 1,
              borderColor: "#d1d5db",
            }}
          >
            <Text>{value || "Selecciona una fecha"}</Text>
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}
        </>
      )}
    </View>
  );
}

export default DateInput;
