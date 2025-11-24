// app/os/laudos/index.tsx
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print"; // Importando expo-print

interface OS {
  id: number;
  numero: string;
  laudos: Array<{ numero: string; data: string; situacaoClimatica: string; descricao: string; imageUri: string | null }>; // Lista de laudos
}

export default function Laudos() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Pega o ID da OS a partir da URL
  const [os, setOs] = useState<OS | null>(null);

  useEffect(() => {
    async function loadOS() {
      const stored = await AsyncStorage.getItem("os_list");
      if (stored) {
        const list: OS[] = JSON.parse(stored);
        const found = list.find((o) => o.id === Number(id));
        if (found) setOs(found);
      }
    }
    loadOS();
  }, [id]);

  if (!os) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>OS não encontrada</Text>
      </View>
    );
  }

  // Função para gerar o PDF do laudo
  const generatePDF = async (laudo: any) => {
    try {
      // Gerar conteúdo HTML para o PDF
      const html = `
        <html>
          <head><meta charset="utf-8"/></head>
          <body>
            <h1>Laudo nº ${laudo.numero}</h1>
            <p><strong>Data:</strong> ${laudo.data}</p>
            <p><strong>Situação Climática:</strong> ${laudo.situacaoClimatica}</p>
            <p><strong>Descrição:</strong></p>
            <p>${laudo.descricao}</p>
            ${laudo.imageUri ? `<img src="${laudo.imageUri}" style="width:300px;"/>` : ""}
          </body>
        </html>
      `;

      // Usando expo-print para gerar PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Exibir caminho do PDF gerado
      Alert.alert("PDF gerado em:", uri);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laudos da OS {os.numero}</Text>
      </View>

      {/* Exibindo os laudos */}
      {os.laudos.length > 0 ? (
        os.laudos.map((laudo, index) => (
          <View key={index} style={styles.laudoCard}>
            {/* Exibe a imagem se houver */}
            {laudo.imageUri && (
              <Image source={{ uri: laudo.imageUri }} style={styles.laudoImage} />
            )}
            <Text style={styles.laudoText}>Número: {laudo.numero}</Text>
            <Text style={styles.laudoText}>Data: {laudo.data}</Text>
            <Text style={styles.laudoText}>Situação Climática: {laudo.situacaoClimatica}</Text>
            <Text style={styles.laudoText}>Descrição: {laudo.descricao}</Text>

            {/* Ícone de PDF para gerar o PDF */}
            <TouchableOpacity onPress={() => generatePDF(laudo)} style={styles.pdfButton}>
              <Text style={styles.pdfButtonText}>Gerar PDF</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noLaudosText}>Nenhum laudo registrado</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/os/add/laudo?id=${id}`)} // Redireciona para a tela de adicionar laudo
      >
        <Text style={styles.buttonText}>Adicionar Laudo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  laudoCard: { marginBottom: 20, padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
  laudoText: { fontSize: 16, color: "#333", marginBottom: 5 },
  laudoImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  noLaudosText: { textAlign: "center", color: "#999", fontSize: 16 },
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
  pdfButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  pdfButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
