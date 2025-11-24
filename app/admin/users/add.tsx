import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function AddUser() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [acesso, setAcesso] = useState("colaborador");

  async function handleSave() {
    if (!usuario || !senha || !acesso) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.9:8081/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          senha,
          acesso,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro ao salvar", data.error || "Erro desconhecido.");
        return;
      }

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.back();

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={styles.label}>Acesso</Text>

      <Picker
        selectedValue={acesso}
        onValueChange={(value) => setAcesso(value)}
        style={styles.picker}
      >
        <Picker.Item label="Administrador" value="admin" />
        <Picker.Item label="Colaborador" value="colaborador" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  input: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 2,
  },

  picker: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  backBtn: { marginTop: 15, alignItems: "center" },
  backText: { color: "#666", fontSize: 15 },
});