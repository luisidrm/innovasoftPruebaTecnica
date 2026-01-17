import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

type Option = "Nombre" | "Identificación";

interface Props {
  onChange?: (value: Option) => void;
  defaultValue?: Option;
}

export default function SegmentSelector({
  onChange,
  defaultValue = "Nombre",
}: Props) {
  const [selected, setSelected] = useState<Option>(defaultValue);

  const select = (value: Option) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <View style={styles.container}>
      {(["Nombre", "Identificación"] as Option[]).map((item) => {
        const active = selected === item;
        return (
          <TouchableOpacity
            key={item}
            style={[styles.button, active && styles.activeButton]}
            onPress={() => select(item)}
          >
            {active && <MaterialIcons name="check" size={18} color="#111" />}
            <Text style={[styles.text, active && styles.activeText]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 4,
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginHorizontal: 2,
  },
  activeButton: {
    backgroundColor: "#e5e7eb",
  },
  text: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 4,
  },
  activeText: {
    fontWeight: "600",
    color: "#111",
  },
});
