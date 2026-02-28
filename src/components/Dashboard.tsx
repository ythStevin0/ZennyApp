import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isToday, isYesterday, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Transaction, UserProfile } from '../types';
import { getCategoryIcon, formatRupiah } from '../utils';
import { Colors } from '../utils/colors';

interface DashboardProps {
  transactions: Transaction[];
  balance: number;
  income: number;
  expense: number;
  onProfileClick: () => void;
  user: UserProfile;
}

export function Dashboard({ transactions, balance, income, expense, onProfileClick, user }: DashboardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const grouped: Record<string, Transaction[]> = {};
  transactions.forEach((t) => {
    const day = t.date.split('T')[0];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(t);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Hari Ini';
    if (isYesterday(d)) return 'Kemarin';
    return format(d, 'EEEE, d MMM', { locale: id });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerDecor} />

        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.profileBtn} onPress={onProfileClick}>
            <View style={styles.avatar}>
              {user.photoUri ? (
                <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={24} color={Colors.primaryDeep} />
              )}
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back 👋</Text>
              <Text style={styles.nameText}>{user.name}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.gray600} />
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceLabelRow}>
            <Text style={styles.balanceLabel}>Total Saldo</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Ionicons
                name={showBalance ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={Colors.gray400}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? formatRupiah(balance) : 'Rp ••••••••'}
          </Text>
        </View>

        {/* Income / Expense Cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.cardIconRow}>
              <View style={styles.incomeIconBg}>
                <Ionicons name="arrow-up" size={16} color={Colors.income} />
              </View>
              <Text style={styles.incomeLabelText}>PEMASUKAN</Text>
            </View>
            <Text style={styles.summaryAmount}>
              {showBalance ? formatRupiah(income) : 'Rp ••••••••'}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <View style={styles.cardIconRow}>
              <View style={styles.expenseIconBg}>
                <Ionicons name="arrow-down" size={16} color={Colors.expense} />
              </View>
              <Text style={styles.expenseLabelText}>PENGELUARAN</Text>
            </View>
            <Text style={styles.summaryAmount}>
              {showBalance ? formatRupiah(expense) : 'Rp ••••••••'}
            </Text>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.txSection}>
        <View style={styles.txHeader}>
          <Text style={styles.txTitle}>Riwayat Transaksi</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {sortedDates.map((date) => (
          <View key={date} style={styles.txGroup}>
            <Text style={styles.txGroupLabel}>{formatDate(date)}</Text>
            <View style={styles.txCard}>
              {grouped[date].map((t, i) => (
                <View
                  key={t.id}
                  style={[
                    styles.txItem,
                    i < grouped[date].length - 1 && styles.txItemBorder,
                  ]}
                >
                  <View style={[styles.txIcon, t.type === 'income' ? styles.txIconIncome : styles.txIconExpense]}>
                    <Text style={styles.txIconEmoji}>{getCategoryIcon(t.category)}</Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txCategory}>{t.category}</Text>
                    <Text style={styles.txNote}>{t.note || t.category}</Text>
                  </View>
                  <Text style={[styles.txAmount, t.type === 'income' ? styles.txAmountIncome : styles.txAmountExpense]}>
                    {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
            <Text style={styles.emptySubtitle}>
              Mulai catat keuanganmu hari ini dengan menekan tombol +
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    backgroundColor: Colors.white,
    paddingBottom: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute',
    top: -128,
    right: -128,
    width: 256,
    height: 256,
    backgroundColor: Colors.purple50,
    borderRadius: 128,
    opacity: 0.5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    marginLeft: -8,
    borderRadius: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: Colors.purple100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  welcomeText: { fontSize: 11, color: Colors.gray500, fontWeight: '500' },
  nameText: { fontSize: 17, fontWeight: '700', color: Colors.text },
  bellBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.gray50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray100,
  },

  balanceSection: { paddingHorizontal: 24, marginBottom: 24 },
  balanceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  balanceLabel: { fontSize: 13, color: Colors.gray500, fontWeight: '500' },
  balanceAmount: { fontSize: 34, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },

  cardsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12 },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeCard: { backgroundColor: Colors.incomeBg, borderWidth: 1, borderColor: Colors.incomeBorder },
  expenseCard: { backgroundColor: Colors.expenseBg, borderWidth: 1, borderColor: Colors.expenseBorder },
  cardIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  incomeIconBg: {
    width: 32, height: 32, backgroundColor: Colors.green100,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  expenseIconBg: {
    width: 32, height: 32, backgroundColor: Colors.red100,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  incomeLabelText: { fontSize: 10, fontWeight: '700', color: Colors.income, letterSpacing: 0.5 },
  expenseLabelText: { fontSize: 10, fontWeight: '700', color: Colors.expense, letterSpacing: 0.5 },
  summaryAmount: { fontSize: 16, fontWeight: '700', color: Colors.text },

  txSection: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  txTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primaryDeep, fontWeight: '600' },

  txGroup: { marginBottom: 20 },
  txGroupLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.gray400,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingLeft: 4,
  },
  txCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.gray100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  txItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray50 },
  txIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  txIconIncome: { backgroundColor: Colors.incomeBg },
  txIconExpense: { backgroundColor: Colors.expenseBg },
  txIconEmoji: { fontSize: 22 },
  txInfo: { flex: 1 },
  txCategory: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  txNote: { fontSize: 11, color: Colors.gray400, fontWeight: '500' },
  txAmount: { fontSize: 13, fontWeight: '700' },
  txAmountIncome: { color: Colors.income },
  txAmountExpense: { color: Colors.text },

  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 40, marginBottom: 12, opacity: 0.5 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: Colors.gray400, textAlign: 'center', maxWidth: 200 },
});
