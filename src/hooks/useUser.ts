import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const STORAGE_KEY = 'zenny_user';

const DEFAULT_USER: UserProfile = {
  name: 'Ahmad Nazar',
  email: 'ahmadnazar@gmail.com',
  phone: '0812 3456 7890',
  photoUri: undefined,
};

export function useUser() {
  const [user, setUserState] = useState<UserProfile>(DEFAULT_USER);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUserState(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Failed to load user data', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const saveUser = async (updatedUser: UserProfile) => {
    setUserState(updatedUser);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.log('Failed to save user data', e);
    }
  };

  return { user, saveUser, loaded };
}
