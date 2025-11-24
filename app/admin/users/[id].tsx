import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

export default function EditUser() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [acesso, setAcesso] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`http://192.168.0.9:8082/usuarios`);
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        const users = await response.json();
        const user = users.find((u: any) => u.id == id);
        if (!user) throw new Error("Usuário não encontrado");

        setUsuario(user.usuario);
        setSenha(user.senha);
        setAcesso(user.acesso);
      } catch (err: any) {
        console.error(err);
        Alert.alert("Erro", err.message);
      }
    }
    fetchUser();
  }, [id]);

  async function handleSave() {
    if (!usuario || !senha || !acesso) {
      Alert.alert("Erro", "Todos os campos são obrigatórios");
      return;
    }

    try {
      const response = await fetch(`http://192.168.0.9:8082/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha, acesso }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar alterações");
      }

      Alert.alert("Sucesso", "Usuário atualizado com sucesso");
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário #{id}</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Acesso (admin/colaborador)"
        value={acesso}
        onChangeText={setAcesso}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
  button: {
    backgroundColor: "#e69138",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backBtn: { marginTop: 15, alignItems: "center" },
  backText: { color: "#666" },
});