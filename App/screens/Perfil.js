import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function Perfil({ navigation }) {
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email || "Usuario");
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
            }
          }
        }
      ]
    );
  };

  const navigateToCitas = () => {
    navigation.navigate('Cita');
  };

  const handleConfiguracion = () => {
    Alert.alert("Configuración", "Esta sección aún no está disponible.");
  };

  const handleAyuda = () => {
    Alert.alert("Ayuda", "Contacta a soporte si necesitas ayuda.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>


      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionRow} onPress={navigateToCitas}>
          <View style={styles.optionContent}>
            <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>Mis citas</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={handleConfiguracion}>
          <View style={styles.optionContent}>
            <Ionicons name="settings-outline" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>Configuración</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={handleAyuda}>
          <View style={styles.optionContent}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>¿Necesitas ayuda?</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionRow, styles.logoutButton]} onPress={handleLogout}>
          <View style={styles.optionContent}>
            <Ionicons name="log-out-outline" size={24} color={Colors.tomato} />
            <Text style={[styles.optionText, styles.logoutText]}>Cerrar sesión</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={Colors.tomato} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
    paddingTop: 60,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  optionsContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: Colors.black,
    marginLeft: 15,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: Colors.tomato,
  },
});