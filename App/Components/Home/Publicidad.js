import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import GeneralApi from "../../Services/GeneralApi";

const { width } = Dimensions.get("screen");

export default function Publicidad() {
  const [publicidadList, setPublicidadList] = useState([]);

  useEffect(() => {
    getPublicidad();
  }, []);

  const getPublicidad = () => {
    GeneralApi.getPublicidad().then((resp) => {
      setPublicidadList(resp.data.data);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={publicidadList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.Image?.[0]?.url }} style={styles.image} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  image: {
    width: width * 0.7,
    height: 170,
    borderRadius: 10,
    marginHorizontal: 5,
    resizeMode: "cover",
  },
});
