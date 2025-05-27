import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import GeneralApi from '../Services/GeneralApi'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/Colors.js"

export default function ListaProfesionalesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params || {};
  
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      getProfesionalesPorCategoria(categoryId);
    } else {
      setLoading(false);
    }
  }, [categoryId]);

  const getProfesionalesPorCategoria = async (id) => {
    try {
      setLoading(true);
      const resp = await GeneralApi.getProfesionalesByCategoriaId(id); 
      console.log("Profesionales recibidos:", resp.data); 

      if (resp.data && Array.isArray(resp.data.data)) {
        setProfesionales(resp.data.data);
      } else {
        console.error("La respuesta de profesionales no es un array o es undefined:", resp.data);
        setProfesionales([]);
      }
    } catch (error) {
      console.error("Error al obtener profesionales por categoría:", error);
      setProfesionales([]);
    } finally {
      setLoading(false);
    }
  };

  const renderProfesionalCard = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => console.log('Profesional seleccionado:', item.Name)}>
      {item.Image && Array.isArray(item.Image) && item.Image.length > 0 && item.Image[0].url && (
         <Image source={{ uri: item.Image[0].url }} style={styles.profesionalImage} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.profesionalName}>{item.Name}</Text> 
        <Text style={styles.profesionalService}>{item.Service}</Text> 
        <Text style={styles.profesionalExperience}>Experiencia: {item.Experience} años</Text> 
        {item.Rating !== undefined && <Text style={styles.profesionalRating}>Calificación: {item.Rating}/5</Text>}
        {item.Location && <Text style={styles.profesionalLocation}>Ubicación: {item.Location}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName || 'Profesionales'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={profesionales}
          renderItem={renderProfesionalCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay profesionales disponibles en esta categoría.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profesionalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderColor: '#eee',
    borderWidth: 1,
  },
  infoContainer: {
    flex: 1,
  },
  profesionalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profesionalService: {
    fontSize: 15,
    color: '#666',
    marginBottom: 3,
  },
  profesionalExperience: {
    fontSize: 14,
    color: '#888',
  },
  profesionalRating: { 
    fontSize: 14,
    color:Colors.primary,
    marginTop: 2,
  },
  profesionalLocation: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
});