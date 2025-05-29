import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { auth } from '../../FirebaseConfig';
import GeneralApi from '../Services/GeneralApi.js';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors.js';

export default function Cita({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFirebaseUserId, setCurrentFirebaseUserId] = useState(null);

  const fetchCitas = useCallback(async (userId) => {
    if (!userId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (!refreshing && citas.length === 0) setLoading(true);

    try {
      const response = await GeneralApi.getCitasByUserId(userId);      

      const fetchedCitas = response.data.data.map(item => ({
        id: item?.id,
        fechaHora: new Date(item?.fechaHora),
        estado: item?.estado,
        profesionalNombre: item?.professional?.Name,
        ubicacion: item?.professional?.Location,
        telefono: item?.professional?.Phone,
        profesionalImagenUrl: item?.professional?.Image?.[0]?.url,
      }));
      setCitas(fetchedCitas);
    } catch (error) {
      console.error("Error al cargar citas:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "No se pudieron cargar tus citas. Inténtalo de nuevo más tarde.");
      setCitas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, citas.length]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const user = auth.currentUser;
      if (user) {
        fetchCitas(user.uid);
      }
    });
  
    return unsubscribe;
  }, [navigation, fetchCitas]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentFirebaseUserId(user.uid);
      fetchCitas(user.uid);
    } else {
      setLoading(false);
    }
  }, [fetchCitas]);

  const onRefresh = () => {
    if (loading) return;
    setRefreshing(true);
    fetchCitas(currentFirebaseUserId);
  };

  const handleCancelCita = (citaId) => {
    Alert.alert(
      "Confirmar Cancelación",
      "¿Estás seguro de que deseas cancelar esta cita?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await GeneralApi.deleteCita(citaId);
              Alert.alert("Éxito", "Cita cancelada correctamente.");
              await fetchCitas(currentFirebaseUserId);
            } catch (error) {
              console.error("Error al cancelar cita:", error);
              Alert.alert("Error", "No se pudo cancelar la cita. Inténtalo de nuevo.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleEditCita = (cita) => {
    const serializableCita = {
      ...cita,
      fechaHora: cita.fechaHora.toISOString(),
    };
    navigation.navigate('Inicio', {
        screen: 'EditCita',
        params: { cita: serializableCita },
    });
  };

  const getStatusTextStyles = (estado) => {
    let textColor = Colors.grayDescription;
    let borderColor = 'transparent';
    let backgroundColor = 'transparent';

    if (estado === 'Cancelada') {
      textColor = Colors.cancelledText;
      borderColor = Colors.cancelledBorder;
      backgroundColor = Colors.cancelledBackground;
    } else if (estado === 'Confirmada') {
      textColor = Colors.confirmedText;
      borderColor = Colors.confirmedBorder;
      backgroundColor = Colors.confirmedBackground;
    } else if (estado === 'Pendiente') {
      textColor = Colors.pendingText;
      borderColor = Colors.pendingBorder;
      backgroundColor = Colors.pendingBackground;
    }

    return {
      color: textColor,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
      </View>

      {(loading && citas.length === 0) ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.tomato} />
          <Text style={styles.loadingText}>Cargando tus citas...</Text>
        </View>
      ) : (
        (!loading && citas.length === 0) ? (
          <View style={styles.noCitasContainer}>
            <Ionicons name="calendar-outline" size={100} color={Colors.placeholderIcon} />
            <Text style={styles.noCitasText}>No tienes citas programadas.</Text>
            <Text style={styles.noCitasSubText}>¡Reserva tu primera cita ahora!</Text>
          </View>
        ) : (
          <FlatList
            data={citas}
            renderItem={({ item }) => {
              const statusStyles = getStatusTextStyles(item.estado);
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    {item.profesionalImagenUrl ? (
                      <Image
                        source={{ uri: item.profesionalImagenUrl }}
                        style={styles.professionalImage}
                      />
                    ) : (
                      <View style={[styles.professionalImage, { backgroundColor: Colors.professionalImagePlaceholder, justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="person-circle-outline" size={50} color={Colors.professionalIconPlaceholder} />
                      </View>
                    )}
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.professionalName}>{item.profesionalNombre}</Text>
                      <Text style={styles.appointmentDate}>
                        {item.fechaHora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Text>
                      <Text style={styles.appointmentTime}>
                        {item.fechaHora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDetails}>
                    {item.ubicacion && (
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={18} color={Colors.grayDescription} />
                        <Text style={styles.detailText}>{item.ubicacion}</Text>
                      </View>
                    )}
                    {item.telefono && (
                      <View style={styles.detailRow}>
                        <Ionicons name="call-outline" size={18} color={Colors.grayDescription} />
                        <Text style={styles.detailText}>{item.telefono}</Text>
                      </View>
                    )}
                    <View style={[styles.detailRow, styles.statusDisplayContainer, { borderColor: statusStyles.borderColor, backgroundColor: statusStyles.backgroundColor }]}>
                      <Ionicons name="information-circle-outline" size={18} color={statusStyles.color} />
                      <Text style={[styles.detailText, { color: statusStyles.color, fontWeight: 'bold' }]}>
                          Estado: {item.estado}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    {item.estado === 'Pendiente' ? (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.editButton]}
                          onPress={() => handleEditCita(item)}
                        >
                          <Ionicons name="create-outline" size={20} color={Colors.white} />
                          <Text style={styles.actionButtonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => handleCancelCita(item.id)}
                        >
                          <Ionicons name="close-circle-outline" size={20} color={Colors.white} />
                          <Text style={styles.actionButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={[styles.statusText, { color: statusStyles.color }]}>Cita {item.estado}</Text>
                    )}
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.tomato]}
              />
            }
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundScreen,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.grayDescription,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  professionalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: Colors.professionalImagePlaceholder,
  },
  cardTitleContainer: {
    flex: 1,
  },
  professionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  appointmentDate: {
    fontSize: 16,
    color: Colors.appointmentDateText,
    marginTop: 5,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tomato,
    marginTop: 2,
  },
  cardDetails: {
    paddingTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 15,
    color: Colors.grayDescription,
    marginLeft: 10,
  },
  statusDisplayContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  noCitasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCitasText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.noCitasText,
    marginTop: 20,
  },
  noCitasSubText: {
    fontSize: 16,
    color: Colors.noCitasSubText,
    marginTop: 5,
    textAlign: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: Colors.editButton,
  },
  cancelButton: {
    backgroundColor: Colors.tomato,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statusText: {
    fontSize: 16,
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  }
});