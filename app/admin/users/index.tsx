import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const API_URL = "http://192.168.0.9:8081";

  // Carrega usuários
  async function loadUsers() {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os usuários");
    }
  }

  // Excluir usuário
  async function deleteUser(id) {
    Alert.alert(
      "Excluir Usuário",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${API_URL}/usuarios/${id}`, {
                method: "DELETE",
              });
              loadUsers();
            } catch (err) {
              Alert.alert("Erro", "Não foi possível excluir o usuário");
            }
          },
        },
      ]
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Usuário</Text>
        <Text style={styles.headerText}>Acesso</Text>
        <Text style={styles.headerText}></Text>
      </View>

      {/* Lista */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.id}</Text>
            <Text style={styles.rowText}>{item.usuario}</Text>
            <Text style={styles.rowText}>{item.acesso}</Text>

            {/* Editar */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push(`/admin/users/${item.id}`)}
            >
              <Ionicons name="create-outline" size={22} color="#000" />
            </TouchableOpacity>

            {/* Excluir */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => deleteUser(item.id)}
            >
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Botão adicionar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/admin/users/add")}
      >
        <Text style={styles.addButtonText}>ADICIONAR USUÁRIO +</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  headerText: { fontWeight: "bold", fontSize: 14, width: 80 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e6e6e6",
  },

  rowText: { width: 80, fontSize: 14 },

  iconButton: { marginHorizontal: 5 },

  addButton: {
    backgroundColor: "#DADADA",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
});