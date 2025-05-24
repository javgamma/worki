import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../../constants/Colors";

export default function SearchBar({setSearchText}) {
    const [searchInput, setSearchInput]= useState();
  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.searchbar}>
        <Ionicons name="search" size={24} color={Colors.green} />
        <TextInput 
        placeholder="Buscar"
        onChangeText={(value) => setSearchInput(value)}
        onSubmitEditing={()=> setSearchText(searchInput)}
        style={{width:'100%'}} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  searchbar: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    borderWidth: 0.6,
    borderColor:Colors.bordesGrises,
    borderRadius:8,
    padding:8
  },
});