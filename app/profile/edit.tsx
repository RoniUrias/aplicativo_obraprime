import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Botão voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#000" />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <Ionicons name="person-circle-outline" size={100} color="#000" />

        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Selecionar foto</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        
        <Text style={styles.label}>Nome:</Text>
        <TextInput style={styles.input} placeholder="Admin" value="Admin" />

        <Text style={styles.label}>Endereço:</Text>
        <TextInput style={styles.input} placeholder="Digite o endereço" />

        <Text style={styles.label}>Bairro:</Text>
        <TextInput style={styles.input} placeholder="Digite o bairro" />

        <Text style={styles.label}>Nmr:</Text>
        <TextInput style={styles.input} placeholder="Número" keyboardType="numeric" />

      </View>

      {/* Botão salvar */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>SALVAR</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 25,
  },

  backButton: {
    marginBottom: 10,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  photoButton: {
    backgroundColor: "#F3D6CF",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginTop: 10,
  },

  photoButtonText: {
    color: "#000",
    fontWeight: "600",
  },

  formContainer: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: "#FF8A34",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 25,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});