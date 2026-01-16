import { ScreenContainer } from "react-native-screens";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppSelector } from "../../../store/hooks";
import { Ionicons, MaterialIcons} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const userName = useAppSelector(state => state.auth.username);

  const handlePress = (item: string) => {
    navigation.navigate(item as never)
  };

  return (
    <ScreenContainer>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={32} color="black" />
            <Text style={styles.username}>{userName}</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.card} onPress={()=>handlePress("Clientes")}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="3g-mobiledata" size={28} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.title}>Clientes</Text>
            <Text style={styles.subtitle}>Administrar Clientes</Text>
          </View>
        </TouchableOpacity>

      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
});