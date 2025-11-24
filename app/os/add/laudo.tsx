// app/os/add/laudo.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";  // Importa o ImagePicker
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AddLaudo() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Pega o ID da OS a partir da URL
  const [numeroLaudo, setNumeroLaudo] = useState("");
  const [dataLaudo, setDataLaudo] = useState("");
  const [situacaoClimatica, setSituacaoClimatica] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);  // Armazena o URI da imagem selecionada

  // Função para selecionar imagem da galeria
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Você precisa permitir o acesso à galeria de fotos.");
      return;
    }

    // Lança a galeria de fotos sem permitir edição (sem corte)
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Desabilita a edição (evita o corte da imagem)
      quality: 1,  // Qualidade máxima
    });

    // Verifica se a seleção foi bem-sucedida
    if (!pickerResult.canceled) {
      if (pickerResult.assets && pickerResult.assets[0]?.uri) {
        setImageUri(pickerResult.assets[0]?.uri);  // Atualiza o URI da imagem
      } else {
        alert("Erro ao obter a URI da imagem.");
      }
    } else {
      alert("Seleção de imagem cancelada.");
    }
  };

  // Função para salvar o laudo
  const handleSaveLaudo = async () => {
    if (!numeroLaudo || !dataLaudo || !descricao) {
      Alert.alert("Erro", "Preencha todos os campos antes de salvar.");
      return;
    }

    const laudo = {
      numero: numeroLaudo,
      data: dataLaudo,
      situacaoClimatica,
      descricao,
      imageUri,  // Adiciona a imagem ao laudo
    };

    const stored = await AsyncStorage.getItem("os_list");
    const list = stored ? JSON.parse(stored) : [];
    const osIndex = list.findIndex((os: any) => os.id === Number(id));
    if (osIndex > -1) {
      list[osIndex].laudos.push(laudo); // Adiciona o laudo à OS existente
      await AsyncStorage.setItem("os_list", JSON.stringify(list));
      Alert.alert("Sucesso", "Laudo adicionado com sucesso!");
      router.back(); // Volta para a tela anterior
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Laudo</Text>

      <TextInput
        style={styles.input}
        placeholder="Número do Laudo"
        value={numeroLaudo}
        onChangeText={setNumeroLaudo}
      />
      <TextInput
        style={styles.input}
        placeholder="Data do Laudo"
        value={dataLaudo}
        onChangeText={setDataLaudo}
      />
      <TextInput
        style={styles.input}
        placeholder="Situação Climática"
        value={situacaoClimatica}
        onChangeText={setSituacaoClimatica}
      />
      <TextInput
        style={styles.textarea}
        placeholder="Descrição do que foi feito"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {/* Exibe a imagem selecionada, se houver */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {/* Botão para selecionar foto */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Selecionar Foto</Text>
      </TouchableOpacity>

      {/* Botão para salvar o laudo */}
      <TouchableOpacity style={styles.button} onPress={handleSaveLaudo}>
        <Text style={styles.buttonText}>Salvar Laudo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  textarea: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});
