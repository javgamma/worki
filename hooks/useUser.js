
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useUser() {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuario autenticado:', user);
        console.log('DisplayName:', user.displayName);
        if (user.displayName) {
          setNombre(user.displayName);
        } else {
          try {
            const storedData = await AsyncStorage.getItem(`@user_${user.uid}`);
            if (storedData) {
              const parsed = JSON.parse(storedData);
              setNombre(`${parsed.nombre} ${parsed.apellido}`);
              console.log('Nombre desde AsyncStorage:', parsed.nombre, parsed.apellido);
            }
          } catch (err) {
            console.error('Error leyendo AsyncStorage:', err);
          }
        }
      } else {
        setNombre('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { nombre, loading };
}
