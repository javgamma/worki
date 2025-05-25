import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GeneralApi from "../../Services/GeneralApi";

const { width } = Dimensions.get('window');
const categoryItemWidth = (width - 40) / 4;

export default function Categorias() {
  const [listaCategoria, setListaCategoria] = useState([]);

  const pastelColors = [
    '#FFD1DC',
    '#90e0ef', 
    '#c8b6ff', 
    '#FAFAD2', 
    '#52b69a', 
    '#FFEFD5', 
  ];

  useEffect(() => {
    getCategoria();
  }, []);

  const getCategoria = async () => {
    try {
      const resp = await GeneralApi.getCategoria();
      if (resp.data && Array.isArray(resp.data.data)) {
        setListaCategoria(resp.data.data);
      } else {
        console.error("La respuesta de la API no es un array o es undefined:", resp.data);
        setListaCategoria([]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setListaCategoria([]);
    }
  };

  if (!listaCategoria.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Categorías</Text>
      <View style={styles.categoryGrid}>
        {listaCategoria.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryItem}
            onPress={() => console.log('Categoría seleccionada:', item.Name)}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: pastelColors[index % pastelColors.length] }
            ]}>
              {item.Icon && Array.isArray(item.Icon) && item.Icon.length > 0 && (
                <Image source={{ uri: item.Icon[0].url }} style={styles.categoryIcon} />
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>{item.Name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10, 
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 15,
    width: categoryItemWidth,
  },
  iconContainer: {
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    width: 40, 
    height: 40, 
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14, 
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 80,
  },
});