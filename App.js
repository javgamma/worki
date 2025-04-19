import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './App/screens/LoginPage';

export default function App() {
  return (
    <View >
     <LoginPage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccc',
    
  },
});
