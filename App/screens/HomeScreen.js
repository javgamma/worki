import React, { useEffect, useState } from "react";
import { View, Text, Button, Pressable, TouchableOpacity } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Components/Home/Header";
import SearchBar from "../Components/Home/SearchBar";
import Slider from "../Components/Home/Slider";
import Categorias from "../Components/Home/Categorias";
import Publicidad from "../Components/Home/Publicidad";

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
    <View style={{padding:20, marginTop:30}}>
      <Header />
      <SearchBar setSearchText={(value)=>console.log(value)
      }/>
      <Slider/>
      <Categorias navigation={navigation}/>
      <Publicidad/>

    </View>
    
  );
}
