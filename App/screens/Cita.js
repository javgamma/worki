import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Image, RefreshControl } from 'react-native';
import { auth } from '../../FirebaseConfig'; 
import GeneralApi from '../Services/GeneralApi.js'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function Cita() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFirebaseUserId, setCurrentFirebaseUserId] = useState(null);

  const fetchCitas = useCallback(async (userId) => {
    if (!userId) {
      console.log("No Firebase User ID found for fetching citas.");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setLoading(true);
    setRefreshing(true);
    try {
     
      const response = await GeneralApi.getCitasByUserId(userId);
      // console.log("Respuesta de citas de Strapi:", JSON.stringify(response.data, null, 2)); 
   
      const fetchedCitas = response.data.data.map(item => ({
        id: item.id,
        fechaHora: new Date(item.fechaHora),
        estado: item.estado,
        profesionalNombre: item.professional.Name,
        ubicacion: item.professional.Location,
        telefono: item.professional.Phone,
        profesionalImagenUrl: item.professional.Image?.[0]?.url, 
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
  }, []);

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
    fetchCitas(currentFirebaseUserId);
  };

  const renderCitaItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.profesionalImagenUrl && (
          <Image 
            source={{ uri: item.profesionalImagenUrl }} 
            style={styles.professionalImage} 
          />
        )}
        {!item.profesionalImagenUrl && ( 
          <View style={[styles.professionalImage, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="person-circle-outline" size={50} color="#999" />
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
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.detailText}>{item.ubicacion}</Text>
          </View>
        )}
        {item.telefono && (
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={18} color="#555" />
            <Text style={styles.detailText}>{item.telefono}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="information-circle-outline" size={18} color="#555" />
          <Text style={styles.detailText}>Estado: {item.estado}</Text>
        </View>
      </View>
    </View>
  );

  if (loading && citas.length === 0) { 
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" />
        <Text style={styles.loadingText}>Cargando tus citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
      </View>

      {citas.length === 0 && !loading ? (
        <View style={styles.noCitasContainer}>
          <Ionicons name="calendar-outline" size={100} color="#ccc" />
          <Text style={styles.noCitasText}>No tienes citas programadas.</Text>
          <Text style={styles.noCitasSubText}>¡Reserva tu primera cita ahora!</Text>
        </View>
      ) : (
        <FlatList
          data={citas}
          renderItem={renderCitaItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["tomato"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
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
    borderBottomColor: '#eee',
  },
  professionalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  cardTitleContainer: {
    flex: 1,
  },
  professionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#tomato',
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
    color: '#555',
    marginLeft: 10,
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
    color: '#888',
    marginTop: 20,
  },
  noCitasSubText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 5,
    textAlign: 'center',
  },
});