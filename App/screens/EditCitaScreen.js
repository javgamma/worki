import React, { useState } from "react";
import {View,Text,StyleSheet,Button,Alert,ActivityIndicator,TouchableOpacity,} from "react-native";
import GeneralApi from "../Services/GeneralApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from '../../constants/Colors';

export default function EditCitaScreen({ route, navigation }) {
  const { cita } = route.params;

  const [loading, setLoading] = useState(false);
  const [fechaEditada, setFechaEditada] = useState(new Date(cita.fechaHora));
  const [horaEditada, setHoraEditada] = useState(new Date(cita.fechaHora));
  const [estadoEditado, setEstadoEditado] = useState(cita.estado);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const estadosCita = ["Pendiente", "Confirmada", "Cancelada"];

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedFechaHora = new Date(fechaEditada);
      updatedFechaHora.setHours(
        horaEditada.getHours(),
        horaEditada.getMinutes(),
        0,
        0
      );

      const updatedCitaData = {
        data: {
          fechaHora: updatedFechaHora.toISOString(),
          estado: estadoEditado,
        },
      };

      await GeneralApi.updateCita(cita.id, updatedCitaData);

      Alert.alert("Éxito", "Cita actualizada correctamente.", [
        { text: "OK", onPress: () => {navigation.navigate('Cita')} }
      ]);
    } catch (error) {
      console.error("Error al actualizar cita:", error.response ? error.response.data : error.message);
      Alert.alert(
        "Error",
        "No se pudo actualizar la cita. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setFechaEditada(selectedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setHoraEditada(selectedTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Cita</Text>
      <Text style={styles.subtitle}>con {cita.profesionalNombre}</Text>

      <View style={styles.formSection}>
        <Text style={styles.label}>Fecha:</Text>
        <Button
          title={fechaEditada.toLocaleDateString()}
          onPress={() => setShowDatePicker(true)}
          color={Colors.primary}
        />
        {showDatePicker && (
          <DateTimePicker
            value={fechaEditada}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Hora:</Text>
        <Button
          title={horaEditada.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          onPress={() => setShowTimePicker(true)}
          color={Colors.primary}
        />
        {showTimePicker && (
          <DateTimePicker
            value={horaEditada}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Estado:</Text>
        <View style={styles.radioGroup}>
          {estadosCita.map((estado) => (
            <TouchableOpacity
              key={estado}
              style={styles.radioButton}
              onPress={() => setEstadoEditado(estado)}
            >
              <View style={styles.radioCircle}>
                {estadoEditado === estado && (
                  <View style={styles.selectedRadioFill} />
                )}
              </View>
              <Text style={styles.radioText}>{estado}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        title={loading ? "Guardando..." : "Guardar Cambios"}
        onPress={handleSave}
        disabled={loading}
        color={Colors.primary}
      />
      {loading && <ActivityIndicator size="large" color={Colors.primary} style={styles.activityIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.backgroundScreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.grayDescription,
    marginBottom: 30,
    textAlign: 'center',
  },
  formSection: {
    width: '90%',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 10,
    color: Colors.gray,
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 5,
    padding:5,
    gap:12,
    paddingHorizontal: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.bordesGrises,
    marginHorizontal: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: Colors.white,
  },
  selectedRadioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  activityIndicator: {
    marginTop: 10,
  },
});