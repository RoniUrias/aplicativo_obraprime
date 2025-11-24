import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OS {
  id: number;
  numero: string;
  data: string;
  descricao: string;
  colaboradores: string;
  status: "aberta" | "andamento" | "concluida";
  cidade?: string;
  endereco?: string;
  bairro?: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ usuario: string; acesso: string } | null>(
    null
  );
  const [quantidadeAbertas, setQuantidadeAbertas] = useState(0);
  const [quantidadeAndamento, setQuantidadeAndamento] = useState(0);
  const [quantidadeConcluidas, setQuantidadeConcluidas] = useState(0);

  // Carregar usuário e OS
  useEffect(() => {
    async function loadData() {
      // Carregar o usuário logado
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.replace("/login"); // Redireciona se não estiver logado
      }

      // Carregar as OS
      const storedOS = await AsyncStorage.getItem("os_list");
      const osList: OS[] = storedOS ? JSON.parse(storedOS) : [];

      // Contar as OS por status
      setQuantidadeAbertas(osList.filter((os) => os.status === "aberta").length);
      setQuantidadeAndamento(
        osList.filter((os) => os.status === "andamento").length
      );
      setQuantidadeConcluidas(
        osList.filter((os) => os.status === "concluida").length
      );
    }

    loadData();
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acompanhamento de OS</Text>

      <View style={styles.statusColumn}>
        <TouchableOpacity
          style={[styles.statusCardFull, { backgroundColor: "#bfbfbf" }]}
        >
          <Ionicons name="alert-circle" size={45} color="#333" />
          <View style={styles.statusTextBlock}>
            <Text style={styles.statusTitle}>Abertas</Text>
            <Text style={styles.statusCount}>{quantidadeAbertas}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusCardFull, { backgroundColor: "#ffcc00" }]}
        >
          <Ionicons name="time" size={45} color="#333" />
          <View style={styles.statusTextBlock}>
            <Text style={styles.statusTitle}>Em andamento</Text>
            <Text style={styles.statusCount}>{quantidadeAndamento}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusCardFull, { backgroundColor: "#4CAF50" }]}
        >
          <Ionicons name="checkmark-done" size={45} color="#fff" />
          <View style={styles.statusTextBlock}>
            <Text style={[styles.statusTitle, { color: "#fff" }]}>
              Concluídas
            </Text>
            <Text style={[styles.statusCount, { color: "#fff" }]}>
              {quantidadeConcluidas}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => router.push("/os")}
        >
          <Ionicons name="document-text" size={30} color="#fff" />
          <Text style={styles.quickText}>OS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => router.push("/os/add")}
        >
          <Ionicons name="add-circle" size={30} color="#fff" />
          <Text style={styles.quickText}>Nova</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person" size={30} color="#fff" />
          <Text style={styles.quickText}>Perfil</Text>
        </TouchableOpacity>

        {/* Mostra botão admin apenas se o acesso for admin */}
        {user?.acesso === "admin" && (
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push("/admin/users")}
          >
            <Ionicons name="settings" size={30} color="#fff" />
            <Text style={styles.quickText}>Admin</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  statusColumn: { width: "90%", alignItems: "center", gap: 20, paddingBottom: 100 },
  statusCardFull: { width: "95%", flexDirection: "row", alignItems: "center", paddingVertical: 35, paddingHorizontal: 20, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  statusTextBlock: { marginLeft: 15 },
  statusTitle: { fontSize: 22, fontWeight: "600" },
  statusCount: { fontSize: 32, fontWeight: "800", marginTop: 4 },
  quickAccessRow: { position: "absolute", bottom: 30, left: 0, right: 0, flexDirection: "row", justifyContent: "space-around" },
  quickButton: { backgroundColor: "#ff6600", width: 70, height: 70, borderRadius: 40, justifyContent: "center", alignItems: "center", elevation: 5 },
  quickText: { marginTop: 5, color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center" },
});
