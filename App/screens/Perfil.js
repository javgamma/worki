import { View, Text } from 'react-native'
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
    <View>
      <Text>Perfil</Text>
    </View>
  )
}