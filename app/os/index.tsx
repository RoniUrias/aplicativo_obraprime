import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker"; // Nova importação

interface OS {
  id: number;
  numero: string;
  data: string; // Agora a data é apenas uma string
  descricao: string;
  colaboradores: string;
  status: "aberta" | "andamento" | "concluida";
}

export default function OSList() {
  const router = useRouter();
  const [osList, setOsList] = useState<OS[]>([]);
  const [filteredOSList, setFilteredOSList] = useState<OS[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"aberta" | "andamento" | "concluida" | "todos">("todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Data de filtro para a OS
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function loadData() {
      const stored = await AsyncStorage.getItem("os_list");
      const osList: OS[] = stored ? JSON.parse(stored) : [];
      setOsList(osList);
      setFilteredOSList(osList);  // Inicializa com todas as OS
    }
    loadData();
  }, []);

  // Função para filtrar OS por status
  const filterOSList = (status: "aberta" | "andamento" | "concluida" | "todos") => {
    setSelectedStatus(status);
    let filtered = osList;

    if (status !== "todos") {
      filtered = filtered.filter((os) => os.status === status);
    }

    // Filtra pela data, se selecionado
    if (selectedDate) {
      filtered = filtered.filter((os) => new Date(os.data).toLocaleDateString() === selectedDate.toLocaleDateString());
    }

    setFilteredOSList(filtered);
  };

  // Função para abrir o picker de data
  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ordens de Serviço</Text>
      </View>

      {/* Filtros no topo (Todos e Data da OS) */}
      <View style={styles.topFiltersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "todos" && styles.selectedFilterButton]}
          onPress={() => filterOSList("todos")}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showDatePickerHandler} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>
            {selectedDate ? selectedDate.toLocaleDateString() : "Data da OS"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de Status abaixo dos outros filtros */}
      <View style={styles.statusFiltersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "aberta" && styles.selectedFilterButton]}
          onPress={() => filterOSList("aberta")}
        >
          <Text style={styles.filterText}>Abertas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "andamento" && styles.selectedFilterButton]}
          onPress={() => filterOSList("andamento")}
        >
          <Text style={styles.filterText}>Em Andamento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedStatus === "concluida" && styles.selectedFilterButton]}
          onPress={() => filterOSList("concluida")}
        >
          <Text style={styles.filterText}>Concluídas</Text>
        </TouchableOpacity>
      </View>

      {/* Exibindo o DatePicker quando necessário */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Lista de OS */}
      <ScrollView style={styles.list}>
        {filteredOSList.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
            Nenhuma OS encontrada para o filtro aplicado.
          </Text>
        ) : (
          filteredOSList.map((os) => (
            <TouchableOpacity
              key={os.id}
              style={styles.card}
              onPress={() => router.push(`/os/${os.id}`)}
            >
              <View
                style={[
                  styles.statusBar,
                  { backgroundColor: getStatusColor(os.status) },
                ]}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.idText}>{os.numero}</Text>
                  <Text style={styles.dateText}>{os.data}</Text>
                </View>
                <Text style={styles.titleText}>{os.descricao}</Text>
                <Text style={styles.collaboratorText}>{os.colaboradores}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Função que retorna a cor de acordo com o status
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
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 10 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold", marginRight: 30 },
  topFiltersContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  filterButton: {
    marginHorizontal: 10,
    backgroundColor: "#f3f3f3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedFilterButton: {
    backgroundColor: "#ff6600",
  },
  filterText: { color: "#333", fontSize: 14 },
  datePickerButton: {
    marginHorizontal: 10,
    backgroundColor: "#f3f3f3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  datePickerText: { color: "#333", fontSize: 14 },
  statusFiltersContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  list: { paddingHorizontal: 20, marginBottom: 80 },
  card: { flexDirection: "row", marginBottom: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 },
  statusBar: { width: 15, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 },
  cardContent: { flex: 1, padding: 15 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  idText: { fontSize: 18, fontWeight: "bold" },
  dateText: { fontSize: 14, color: "#333" },
  titleText: { marginTop: 5, fontSize: 16 },
  collaboratorText: { marginTop: 5, color: "#333" },
});
