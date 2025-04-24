import React, { useEffect } from "react";
import { View, Text, Button, Pressable, TouchableOpacity } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../FirebaseConfig";

export default function HomeScreen({ navigation }) {


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta nuevamente.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>Bienvenido a Worki </Text>
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
