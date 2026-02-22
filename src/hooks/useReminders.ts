import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reminder {
  id: string;
  type: 'bill' | 'subscription';
  name: string;
  amount: number;
  date: string;
  category: string;
  reminderTime: string;
  createdAt: string;
  paid?: boolean;
}

const STORAGE_KEY = 'zenny_reminders';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setReminders(JSON.parse(data));
      } else {
        setReminders([]);
      }
    } catch (e) {
      setReminders([]);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders)).catch(() => {});
  }, [reminders, loaded]);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paid: false,
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const markPaid = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, paid: true } : r))
    );
  };

  return { reminders, addReminder, deleteReminder, markPaid };
}
