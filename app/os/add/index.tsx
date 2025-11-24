import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddOS() {
  const router = useRouter();

  const [numeroOS, setNumeroOS] = useState("");
  const [dataOS, setDataOS] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [descricao, setDescricao] = useState("");
  const [colaboradores, setColaboradores] = useState("");

  async function handleSaveOS() {
    if (!numeroOS || !dataOS || !descricao) {
      Alert.alert("Erro", "Preencha pelo menos Número, Data e Descrição!");
      return;
    }

    const newOS = {
      id: Date.now(), // id único
      numero: numeroOS,
      data: dataOS,
      cidade,
      endereco,
      bairro,
      descricao,
      colaboradores,
      status: "aberta", // padrão
    };

    // Buscar lista existente
    const stored = await AsyncStorage.getItem("os_list");
    const list = stored ? JSON.parse(stored) : [];

    // Adicionar nova OS
    list.push(newOS);

    // Salvar
    await AsyncStorage.setItem("os_list", JSON.stringify(list));

    Alert.alert("Sucesso", "OS adicionada com sucesso!");

    // Voltar para a lista
    router.replace("/os");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Adicionar OS</Text>

        <Text style={styles.label}>Número OS</Text>
        <TextInput
          style={styles.input}
          value={numeroOS}
          onChangeText={setNumeroOS}
          keyboardType="numeric"
          placeholder="Número OS"
        />

        <Text style={styles.label}>Data da OS</Text>
        <TextInput
          style={styles.input}
          value={dataOS}
          onChangeText={setDataOS}
          placeholder="--/--/----"
        />

        <Text style={styles.label}>Local</Text>
        <TextInput
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
          placeholder="Cidade"
        />
        <TextInput
          style={styles.input}
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço - Nmr"
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={bairro}
          onChangeText={setBairro}
          placeholder="Bairro"
        />

        <Text style={styles.label}>Descrição da obra</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição da obra"
        />

        <Text style={styles.label}>Colaboradores</Text>
        <TextInput
          style={styles.input}
          value={colaboradores}
          onChangeText={setColaboradores}
          placeholder="Colaboradores"
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveOS}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Menu inferior igual Home */}
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
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={30} color="#fff" />
          <Text style={styles.quickText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person" size={30} color="#fff" />
          <Text style={styles.quickText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 100,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  quickAccessRow: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickButton: {
    backgroundColor: "#ff6600",
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  quickText: {
    marginTop: 5,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
