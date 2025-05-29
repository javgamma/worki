import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker'; 

import { auth } from '../../FirebaseConfig'; 
import GeneralApi from '../Services/GeneralApi.js'; 
import Colors from '../../constants/Colors.js';

export default function ReservaCitaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { profesionalId, profesionalName } = route.params || {};

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentFirebaseUserId, setCurrentFirebaseUserId] = useState(null);

  useEffect(() => {
    if (!profesionalId) {
      Alert.alert("Error de Navegación", "No se encontró el ID del profesional. Vuelve a la pantalla anterior.");
      navigation.goBack();
      return;
    }

    const user = auth.currentUser;
    if (user) {
      setCurrentFirebaseUserId(user.uid);
      console.log("Firebase User ID:", user.uid); 
    } else {
      Alert.alert("Error de Usuario", "Debes iniciar sesión para reservar una cita.");
      navigation.goBack(); 
    }
  }, [profesionalId]);

  const onChangeDate = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const onChangeTime = (event, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleReservarCita = async () => {
    if (!currentFirebaseUserId) {
      Alert.alert("Error", "No se pudo obtener el ID de usuario. Por favor, reinicia la aplicación o inicia sesión.");
      return;
    }

    setIsSubmitting(true);
    
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      selectedTime.getSeconds()
    );

    const citaData = {
      data: {
        professional: profesionalId,
        fechaHora: combinedDateTime.toISOString(),
        firebaseUSerID: currentFirebaseUserId, 
        // duracionMinutos: 60, 
        estado: 'Pendiente',
        // notas: `Cita con ${profesionalName}` 
      }
    };

    try {
      const resp = await GeneralApi.createCita(citaData);
      console.log("Cita creada en Strapi:", resp.data);

      Alert.alert(
        "Cita Reservada",
        `Tu cita con ${profesionalName} para el ${selectedDate.toLocaleDateString()} a las ${selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ha sido reservada con éxito.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error("Error al reservar la cita en Strapi:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "No se pudo reservar la cita. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Reservar Cita</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.profesionalName}>Profesional: {profesionalName || 'Cargando...'}</Text>

        <Text style={styles.label}>Selecciona la fecha:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>
            {selectedDate.toLocaleDateString()}
          </Text>
          <Ionicons name="calendar-outline" size={24} color="#333" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Selecciona la hora:</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>
            {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Ionicons name="time-outline" size={24} color="#333" />
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={selectedTime}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={handleReservarCita}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  profesionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
    color: '#555',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerButtonText: {
    fontSize: 18,
    color: '#333',
  },
  reserveButton: {
    backgroundColor:Colors.tomato,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8,
  },
  reserveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});