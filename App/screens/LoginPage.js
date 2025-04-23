import { View, Text, Image, StyleSheet, Dimensions, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../firebaseConfig';
import hombreTablet from './../../assets/images/hombreTablet.jpg';
import Colors from './../../constants/Colors.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Usuario Creado');
    } catch (err) {
      console.error(err);
      
      setError('Error al registrarse');
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('¡Sesión iniciada!');
      setError('');
      //Aqui se puede redirgir a la pantalla principal con navigation
    } catch (err) {
      console.error(err);
      setError('email o contraseña incorrecta');
    }
  };

  return (
    <View style={styles.homeLayout}>
      <Image source={hombreTablet} style={styles.loginImage} />

      <View style={{ backgroundColor: Colors.white,marginTop:-70, alignItems: 'center' }}>
        <Text style={styles.title}>
          WORKI
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

        <Pressable onPress={handleLogin} style={styles.viewLoginButton}>
          <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: '500' }}>
            Iniciar sesión
          </Text>
        </Pressable>

        <Pressable onPress={handleRegister} style={[styles.viewLoginButton, { backgroundColor: Colors.white}]}>
          <Text style={{ color: Colors.black, fontSize: 18, fontWeight: '500' }}>
            Registrarse
          </Text>
        </Pressable>

        {error !== '' && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginImage: {
    width: 401,
    height: 600,
    objectFit: 'contain',
    borderRadius: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: -80,
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 20,
    color: Colors.white,
    textAlign: 'center',
  },
  homeLayout: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  viewLoginButton: {
    padding: 13,
    backgroundColor: Colors.secondary,
    borderRadius: 90,
    alignItems: 'center',
    marginTop: 15,
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
    marginTop: 15,
    backgroundColor: '#f5f5f5',
  },
  error: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});
