// app/os/[id].tsx (Detalhes da OS)
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

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
  laudos: string[]; // Lista de laudos
}

export default function OSDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [os, setOs] = useState<OS | null>(null);

  useEffect(() => {
    async function loadOS() {
      const stored = await AsyncStorage.getItem("os_list");
      if (stored) {
        const list: OS[] = JSON.parse(stored);
        const found = list.find((o) => o.id === Number(params.id));
        if (found) {
          found.laudos = found.laudos || []; // Garantir que a propriedade "laudos" sempre seja um array
          setOs(found);
        }
      }
    }
    loadOS();
  }, [params.id]);

  if (!os) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>OS não encontrada</Text>
      </View>
    );
  }

  // Função para editar o status da OS
  const handleEditStatus = async () => {
    if (!os) return;

    const newStatus =
      os.status === "aberta"
        ? "andamento"
        : os.status === "andamento"
        ? "concluida"
        : "aberta";

    const updatedOS = { ...os, status: newStatus };
    const stored = await AsyncStorage.getItem("os_list");
    const osList: OS[] = stored ? JSON.parse(stored) : [];

    const updatedOSList = osList.map((item) =>
      item.id === os.id ? updatedOS : item
    );

    await AsyncStorage.setItem("os_list", JSON.stringify(updatedOSList));

    setOs(updatedOS);
    Alert.alert("Status atualizado", `Status alterado para ${newStatus}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={26}
          color="#000"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Detalhe OS {os.numero}</Text>
      </View>

      {/* Informações da OS */}
      <View style={styles.infoBlock}>
        <Text style={styles.label}>Número OS:</Text>
        <Text style={styles.value}>{os.numero}</Text>

        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>{os.data}</Text>

        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>{os.descricao}</Text>

        <Text style={styles.label}>Colaboradores:</Text>
        <Text style={styles.value}>{os.colaboradores}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: getStatusColor(os.status) }]}>
          {os.status}
        </Text>

        {os.cidade && (
          <>
            <Text style={styles.label}>Cidade:</Text>
            <Text style={styles.value}>{os.cidade}</Text>
          </>
        )}

        {os.endereco && (
          <>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{os.endereco}</Text>
          </>
        )}

        {os.bairro && (
          <>
            <Text style={styles.label}>Bairro:</Text>
            <Text style={styles.value}>{os.bairro}</Text>
          </>
        )}
      </View>

      {/* Botão para editar o status */}
      <TouchableOpacity style={styles.button} onPress={handleEditStatus}>
        <Text style={styles.buttonText}>Alterar Status</Text>
      </TouchableOpacity>

      {/* Botão "Laudos" */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/os/laudos?id=${params.id}`)} // Redireciona para a tela de Laudos
      >
        <Text style={styles.buttonText}>Laudos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getStatusColor(status: OS["status"]) {
  switch (status) {
    case "aberta":
      return "#ccc";
    case "andamento":
      return "#ffcc00";
    case "concluida":
      return "#4CAF50";
    default:
      return "#ccc";
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold" },
  infoBlock: { backgroundColor: "#f9f9f9", padding: 20, borderRadius: 10 },
  label: { fontWeight: "600", marginTop: 10 },
  value: { fontSize: 16, marginTop: 2 },
  button: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
