import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "../screens/LoginPage";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Cita from "../screens/Cita";
import Perfil from "../screens/Perfil";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home-outline';
          } else if (route.name === 'Cita') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Cita" component={Cita} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

// Controla si hay sesión iniciada
export default function Navigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}