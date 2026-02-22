import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const STORAGE_KEY = 'zenny_transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTransactions(JSON.parse(stored));
      } catch (e) {
        console.log('Failed to load transactions', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)).catch((e) =>
      console.log('Failed to save transactions', e)
    );
  }, [transactions, loaded]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getBalance = () =>
    transactions.reduce(
      (acc, curr) => (curr.type === 'income' ? acc + curr.amount : acc - curr.amount),
      0
    );

  const getIncome = () =>
    transactions.filter((t) => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);

  const getExpense = () =>
    transactions.filter((t) => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  return { transactions, addTransaction, deleteTransaction, getBalance, getIncome, getExpense };
}
