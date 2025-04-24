import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "../screens/LoginPage";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Cita from "../screens/Cita";
import Perfil from "../screens/Perfil";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../FirebaseConfig";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Cita" component={Cita} />
          <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
      ) : (
        <LoginPage />
      )}
    </NavigationContainer>
  );
}
