import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ClientItemProps {
  name: string;
  phone: string;
  avatar?: string;
  onPress?: () => void;
}

export default function ClientItem({
  name,
  phone,
  avatar,
  onPress,
}: ClientItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={
          avatar
            ? { uri: avatar }
            : {uri:"https://cdn-icons-png.flaticon.com/512/149/149071.png"} // optional local fallback
        }
        style={styles.avatar}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  phone: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
});
