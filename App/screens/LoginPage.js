import { View, Text, Image, StyleSheet, Dimensions, TextInput,TouchableOpacity } from 'react-native';
import { Pressable } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../FirebaseConfig.js';
import hombreTablet from './../../assets/images/hombreTablet.jpg';
import Colors from '../../constants/Colors.js';
import { useNavigation } from '@react-navigation/native';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>{
        const user = userCredential.user;
        console.log(user);
      })
      navigation.replace('Home')
    } catch (err) {
      console.error(err);
      setError('Error al registrarse');
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      navigation.replace('Home');
    } catch (err) {
      console.error(err);
      setError('email o contraseña incorrecta');
    }
  };

  return (
    <View style={styles.homeLayout}>
      <View style={styles.containerImage}>
      <Image source={hombreTablet} style={styles.loginImage} />
      </View>

      <View style={styles.divContainer}>
        <Text style={styles.title}>
          worki
        </Text>
        <Text style={styles.subtitle}>
          Agenda tu cita con nuestros expertos y despreocúpate
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleLogin} style={styles.viewLoginButton}>
          <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: '500' }}>
            Iniciar sesión
          </Text>
       </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister} style={[styles.viewLoginButton, { backgroundColor: Colors.white}]}>
          <Text style={{ color: Colors.black, fontSize: 18, fontWeight: '500' }}>
            Registrarse
          </Text>
        </TouchableOpacity>
      

        {error !== '' && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  containerImage: {
    width: '100%',
    overflow: 'hidden', // importante para que el borderRadius funcione
    borderBottomLeftRadius: 60, // curva solo esta esquina
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  loginImage: {
    width: '100%',
    height: 550,
    resizeMode: 'cover',
    // borderRadius: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: -20,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 10,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal:40
  },
  divContainer: {
    backgroundColor: Colors.primaryLight +'80',
    marginTop:-100,
    alignItems: 'center',
    paddingBottom:30,
    borderRadius:15,
  },
  homeLayout: {
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    height:'100%'
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    fontWeight:'600'
  },
  viewLoginButton: {
    padding: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 70,
    alignItems: 'center',
    marginTop: 20,
    width: Dimensions.get('screen').width * 0.5,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  input: {
    width: Dimensions.get('screen').width * 0.8,
    height: 45,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
  },
  error: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});
