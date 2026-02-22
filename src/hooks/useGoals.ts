import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Goal {
  id: string;
  category: string;
  title: string;
  targetAmount: number;
  monthlyAmount: number;
  currentAmount: number;
  note: string;
  createdAt: string;
  targetDate?: string;
  icon: string;
}

const STORAGE_KEY = 'zenny_goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setGoals(JSON.parse(data));
      } else {
        setGoals([]);
      }
    } catch (e) {
      setGoals([]);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals)).catch(() => {});
  }, [goals, loaded]);

  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = { ...goal, id: Date.now().toString(), currentAmount: 0 };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addSavings = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      )
    );
  };

  return { goals, addGoal, deleteGoal, addSavings };
}
