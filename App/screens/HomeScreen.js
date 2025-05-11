import React, { useEffect, useState } from "react";
import { View, Text, Button, Pressable, TouchableOpacity } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {

  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuario autenticado:', user);
        console.log('DisplayName:', user.displayName);

        if (user.displayName) {
          setNombre(user.displayName);
          console.log('Nombre desde Firebase:', user.displayName);
        } else {
          try {
            const storedData = await AsyncStorage.getItem(`@user_${user.uid}`);
            if (storedData) {
              const parsed = JSON.parse(storedData);
              setNombre(`${parsed.nombre} ${parsed.apellido}`);
              console.log('Nombre desde AsyncStorage:', parsed.nombre, parsed.apellido);
            }
          } catch (err) {
            console.error('Error leyendo AsyncStorage:', err);
          }
        }
      } else {
        console.log('No hay usuario autenticado');
        setNombre('');
      }
    });

    return () => unsubscribe();
  }, []);



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
      <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Hola, {nombre} 👋</Text>
    </View>
      <Text style={{ fontSize: 30 }}>Bienvenido a Worki </Text>
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
