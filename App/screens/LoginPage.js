import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import hombreTablet from './../../assets/images/hombreTablet.jpg'
import Colors from './../../constants/Colors.js'


export default function LoginPage() {
  return (
    <View style={styles.homeLayout}>
      <Image source={hombreTablet}
      style={styles.loginImage}
      />
      <View style={{backgroundColor:Colors.white,
        padding:5,
        alignItems:'center',
        }}>
        <Text
        style={styles.title}>
            La solución más rápida cualquier servicio del hogar
        </Text>
        <Text style={styles.subtitle}>Agenda tu cita con nuestros expertos y despreocupate</Text>
        <View style={styles.viewLoginButton}>
        <Text style={{color:Colors.primary, fontSize:18, fontWeight:'500'}}>Inicia sesión</Text>
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    loginImage:{
        width: 401,
        height:600,
        objectFit:'contain',
        borderRadius:40,
        
    
    },
    title:{
        fontSize:26,
        fontWeight:'bold',
        marginTop:-50,
        backgroundColor:Colors.primary,
        padding:20,
        borderRadius:20,
        color:Colors.white
        
    },
    homeLayout:{
        alignItems:'center'
    },
    subtitle:{
        fontSize: 18,
        alignItems:'center',
        marginTop:20,
        paddingHorizontal: 20
    },
    viewLoginButton:{
        padding:16,
        backgroundColor:Colors.secondary,
        borderRadius: 90,
        alignItems: 'center',
        marginTop:25,
        width:Dimensions.get('screen').width*0.6,
        borderColor:Colors.primary,
        borderWidth:1

    }
})