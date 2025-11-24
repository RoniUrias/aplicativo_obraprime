import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!usuario || !senha) {
      Alert.alert("Erro", "Preencha usuário e senha");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.9:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.error || "Usuário ou senha incorretos");
        setLoading(false);
        return;
      }

      // Salva dados do usuário no AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data));

      // Redireciona para home
      router.replace("/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  function handleForgot() {
    router.push("/login/forgot");
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="USUÁRIO"
          placeholderTextColor="#BFBFBF"
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={styles.input}
          placeholder="SENHA"
          placeholderTextColor="#BFBFBF"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity onPress={handleForgot}>
          <Text style={styles.link}>
            Esqueceu sua senha?{" "}
            <Text style={styles.linkHighlight}>Clique aqui</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "ENTRAR"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 25 },
  logo: { width: 170, height: 170, marginBottom: 40, borderRadius: 100 },
  form: { width: "100%", alignItems: "center" },
  input: { width: "100%", height: 50, backgroundColor: "#F1F1F1", borderRadius: 25, paddingHorizontal: 20, marginBottom: 15, fontSize: 15, color: "#000" },
  link: { fontSize: 13, color: "#555", marginBottom: 20 },
  linkHighlight: { color: "#4A90E2" },
  button: { backgroundColor: "#E89A43", width: "100%", height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});