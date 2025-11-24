import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("user"); // Remove usuário logado
      router.replace("/login"); // Redireciona para login
    } catch (err) {
      console.error(err);
      alert("Não foi possível desconectar");
    }
  }

  return (
    <View style={styles.container}>

      {/* Ícone / Avatar */}
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={120} color="#000" />
        <Text style={styles.userName}>Admin</Text>
      </View>

      {/* Lista de opções */}
      <View style={styles.optionsList}>

        {/* Editar Perfil */}
        <TouchableOpacity 
          style={styles.optionRow} 
          onPress={() => router.push("/profile/edit")}
        >
          <Text style={styles.optionText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        {/* Notificações */}
        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        {/* Contatos */}
        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Contatos</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

      </View>

      {/* Botão Desconectar */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Desconectar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },

  optionsList: {
    width: "85%",
    marginTop: 10,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },

  optionText: {
    fontSize: 16,
  },

  logoutButton: {
    marginTop: 50,
    backgroundColor: "#e6e6e6",
    width: "85%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});