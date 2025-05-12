import { View, Text, Image } from "react-native";
import React from "react";
import useUser from "../../../hooks/useUser";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header() {
  const { nombre, loading } = useUser();

  if (loading) {
    return null;
  }

  return (
    <View style={{display:'flex', flexDirection:'row',alignItems:"center", justifyContent:'space-between'}}>
      <View style={{display:'flex', flexDirection:'row', gap:7,alignItems:"center"
      }}>
        <Image
          source={require("../../../assets/images/user.png")}
          style={{ width: 45, height: 45, borderRadius: 99 }}
        />
        <View>
          <Text>Hola</Text>
          <Text style={{
            fontSize:18,
            fontWeight: "bold"
          }}>{nombre}</Text>
        </View>
      </View>
      <Ionicons name="notifications-outline" size={24} color="black" />
    </View>
  );
}
