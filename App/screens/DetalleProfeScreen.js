import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralApi from '../Services/GeneralApi.js';
import Colors from '../../constants/Colors.js';

export default function DetalleProfeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { profesionalId } = route.params || {};

  const [profesionalData, setProfesionalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profesionalId) {
      getDetallesProfesional(profesionalId);
    } else {
      setLoading(false);
    }
  }, [profesionalId]);

  const getDetallesProfesional = async (id) => {
    try {
      setLoading(true);
      const resp = await GeneralApi.getProfesionalById(id);
      console.log("ESTO RECIBO", resp.data.data);
      setProfesionalData(resp.data.data);
    } catch (error) {
      console.error("Error al obtener detalles del profesional:", error);
      setProfesionalData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Cargando detalles del profesional...</Text>
      </View>
    );
  }

  if (!profesionalData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del profesional.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonLarge}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    Name,
    Service,
    Experience,
    Description,
    Phone,
    Email,
    Location,
    PriceEstimate,
    Rating,
    Image: imagenes,
    category
  } = profesionalData;

  const imageUrl = imagenes?.[0]?.formats?.medium?.url || imagenes?.[0]?.url;



  const renderDescription = () => {
    if (!Description || !Array.isArray(Description) || Description.length === 0) return null;

    return (
      <>
        <Text style={styles.descriptionHeader}>Acerca de:</Text>
        {Description.map((block, index) => {
          if (block.type === 'paragraph' && Array.isArray(block.children)) {
            const paragraph = block.children.map((child) => child.text).join('');
            return (
              <Text key={index} style={styles.descriptionText}>
                {paragraph}
              </Text>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{Name}</Text>
      </View>

      <View style={styles.content}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.profesionalImage} />}
       
        <Text style={styles.service}>{Service || 'Servicio no especificado'}</Text>
        <Text style={styles.experience}>
          Experiencia: {Experience !== undefined ? Experience : 'No especificada'} años
        </Text>

        {Rating !== undefined && Rating !== null && (
          <Text style={styles.rating}>
            Calificación: {Rating}/5 <Ionicons name="star" size={16} color="#FFD700" />
          </Text>
        )}

        {Location && (
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" /> {Location}
          </Text>
        )}

        {/* {category?.Name && (
          <Text style={styles.category}>
            <Ionicons name="folder-outline" size={16} color="#666" /> Categoría: {category.Name}
          </Text>
        )} */}

        {renderDescription()}

        <View style={styles.contactInfo}>
          <Text style={styles.contactHeader}>Contacto:</Text>
          {Phone && (
            <Text style={styles.contactText}>
              <Ionicons name="call-outline" size={16} color="#333" /> Teléfono: {Phone}
            </Text>
          )}
          {Email && (
            <Text style={styles.contactText}>
              <Ionicons name="mail-outline" size={16} color="#333" /> Email: {Email}
            </Text>
          )}
          {PriceEstimate !== undefined && (
            <Text style={styles.contactText}>
              <Ionicons name="pricetag-outline" size={16} color="#333" /> Tarifa Estimada: ${PriceEstimate}/hora
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => console.log('Navegar a reserva de cita para:', Name)}
        >
          <Text style={styles.reserveButtonText}>Reservar Cita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginBottom: 20 },
  backButtonLarge: {
    backgroundColor: Colors.rosa,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20
  },
  backButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5
  },
  backButton: { marginRight: 15, padding: 5 },
  title: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  content: { padding: 20, alignItems: 'center' },
  profesionalImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: Colors.tomato,
    marginBottom: 20
  },
  service: { fontSize: 20, fontWeight: 'bold', color: Colors.gray, marginBottom: 5 },
  experience: { fontSize: 16, color: Colors.grayDescription, marginBottom: 10 },
  rating: { fontSize: 16, color: Colors.grayDescription, marginBottom: 10 },
  location: { fontSize: 16, color:Colors.grayDescription, marginBottom: 10 },
  category: { fontSize: 16, color: Colors.grayDescription, marginBottom: 15 },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: Colors.gray
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'justify',
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%'
  },
  contactInfo: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3
  },
  contactHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  contactText: { fontSize: 16, color: '#444', marginBottom: 5 },
  reserveButton: {
    backgroundColor: Colors.tomato,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8
  },
  reserveButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' }
});
