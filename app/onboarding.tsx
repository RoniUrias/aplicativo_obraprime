import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "OBRA PRIME",
    description: "",
    image: require("../assets/images/onboarding1.png"),
  },
  {
    id: "2",
    title: "Acompanhar status",
    description:
      "Acompanhe todas as suas ordens de serviço de forma simples e rápida. Acompanhe desde abertas, andamento e concluídas!",
    image: require("../assets/images/onboarding2.png"),
  },
  {
    id: "3",
    title: "Atualização em Tempo Real",
    description:
      "Acompanhe todas as atualizações em relação às suas Ordens de serviço.",
    image: require("../assets/images/onboarding3.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      router.replace("/login");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.title}>{item.title}</Text>

      <Image source={item.image} style={styles.image} />

      {item.description !== "" && (
        <Text style={styles.description}>{item.description}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setIndex(newIndex);
        }}
      />

      {/* Paginação */}
      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={nextSlide}>
        <Text style={styles.buttonText}>
          {index === slides.length - 1 ? "COMEÇAR" : "PRÓXIMO"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e69138" },

  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
  },

  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 30,
  },

  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    width: "85%",
    lineHeight: 22,
    marginTop: 10,
  },

  pagination: {
    position: "absolute",
    bottom: 110,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  dotActive: {
    backgroundColor: "#fff",
    width: 14,
  },

  dotInactive: {
    backgroundColor: "#ffffff88",
  },

  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 10,
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#e69138",
    fontSize: 16,
  },
});