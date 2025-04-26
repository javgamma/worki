import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';

export default function Perfil() {


    const handleLogout = async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 30 }}>Tu perfil </Text>
          <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
            <Text style={{ color: "blue" }}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
  )
}