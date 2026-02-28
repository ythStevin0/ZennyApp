import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Layout } from './src/components/Layout';
import { Dashboard } from './src/components/Dashboard';
import { AddTransaction } from './src/components/AddTransaction';
import { SmartView } from './src/components/SmartView';
import { Goals } from './src/components/Goals';
import { AddGoal } from './src/components/AddGoal';
import { Reminder } from './src/components/Reminder';
import { AddReminder } from './src/components/AddReminder';
import { Profile } from './src/components/Profile';
import { useTransactions } from './src/hooks/useTransactions';
import { useGoals } from './src/hooks/useGoals';
import { useReminders } from './src/hooks/useReminders';
import { useUser } from './src/hooks/useUser';
import { ActiveTab, UserProfile } from './src/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { transactions, addTransaction, getBalance, getIncome, getExpense } = useTransactions();
  const { goals, addGoal, deleteGoal, addSavings } = useGoals();
  const { reminders, addReminder, deleteReminder, markPaid } = useReminders();
  const { user, saveUser } = useUser();

  const handleTabChange = (tab: 'home' | 'smartview' | 'add' | 'goals' | 'reminder') => {
    if (tab === 'add') {
      if (activeTab === 'reminder') setActiveTab('add-reminder');
      else if (activeTab === 'goals') setActiveTab('add-goal');
      else setActiveTab('add');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top']}>
        <Layout activeTab={activeTab} onTabChange={handleTabChange}>

          {activeTab === 'home' && (
            <Dashboard
              transactions={transactions}
              balance={getBalance()}
              income={getIncome()}
              expense={getExpense()}
              onProfileClick={() => setActiveTab('profile')}
              user={user}
            />
          )}

          {activeTab === 'smartview' && <SmartView transactions={transactions} />}

          {activeTab === 'add' && (
            <AddTransaction
              onAdd={(t) => { addTransaction(t); setActiveTab('home'); }}
              onCancel={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'add-reminder' && (
            <AddReminder
              onSave={(r) => { addReminder(r); setActiveTab('reminder'); }}
              onClose={() => setActiveTab('reminder')}
            />
          )}

          {activeTab === 'add-goal' && (
            <AddGoal
              onSave={(g) => { addGoal(g); setActiveTab('goals'); }}
              onClose={() => setActiveTab('goals')}
            />
          )}

          {activeTab === 'goals' && (
            <Goals
              goals={goals}
              onAddClick={() => setActiveTab('add-goal')}
              onDelete={deleteGoal}
              onAddSavings={addSavings}
            />
          )}

          {activeTab === 'reminder' && (
            <Reminder
              reminders={reminders}
              onAddClick={() => setActiveTab('add-reminder')}
              onMarkPaid={markPaid}
              onDelete={deleteReminder}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              user={user}
              onSaveProfile={saveUser}
              onEditProfileClick={() => {}} // Internal state handles this now
              balance={getBalance()}
              income={getIncome()}
              expense={getExpense()}
            />
          )}

        </Layout>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
});
