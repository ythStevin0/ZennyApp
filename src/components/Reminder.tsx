import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';
import { Reminder as ReminderType } from '../hooks/useReminders';
import { formatRupiah } from '../utils';

interface ReminderProps {
  reminders: ReminderType[];
  onAddClick: () => void;
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
}

type TabType = 'all' | 'bill' | 'subscription';

export function Reminder({ reminders, onAddClick, onMarkPaid, onDelete }: ReminderProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const bills = reminders.filter((r) => r.type === 'bill');
  const subs = reminders.filter((r) => r.type === 'subscription');

  const urgentCount = reminders.filter((r) => {
    if (r.paid) return false;
    const days = Math.ceil((new Date(r.date).getTime() - Date.now()) / 86400000);
    return days <= 5;
  }).length;

  const totalAmount = reminders.filter((r) => !r.paid).reduce((a, r) => a + r.amount, 0);

  const handleMarkPaid = (id: string, name: string) => {
    Alert.alert(
      'Tandai Sudah Dibayar',
      `Konfirmasi pembayaran "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Sudah Bayar',
          onPress: () => {
            onMarkPaid(id);
            Alert.alert('✅ Berhasil', `"${name}" telah ditandai sudah dibayar`);
          },
        },
      ]
    );
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Hapus Reminder',
      `Yakin ingin menghapus "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  const showBills = activeTab === 'all' || activeTab === 'bill';
  const showSubs = activeTab === 'all' || activeTab === 'subscription';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Purple Background */}
      <View style={styles.purpleSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reminder</Text>
            <Text style={styles.subtitle}>Jangan sampai telat bayar!</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={onAddClick}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.sumLabel}>Perlu Perhatian</Text>
            <Text style={styles.sumValue}>{urgentCount}</Text>
            <Text style={styles.sumSub}>Tagihan Mendesak</Text>
            <View style={styles.sumBar}>
              <View style={[styles.sumBarFill, { width: urgentCount > 0 ? '75%' : '0%' }]} />
            </View>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.sumLabel}>Total Belum Bayar</Text>
            <Text style={[styles.sumValue, { fontSize: 18 }]}>{formatRupiah(totalAmount)}</Text>
            <Text style={styles.sumSub}>{reminders.filter(r => !r.paid).length} Tagihan</Text>
            <View style={styles.sumBar}>
              <View style={[styles.sumBarFill, { width: '50%' }]} />
            </View>
          </View>
        </View>
      </View>

      {/* List Section */}
      <View style={styles.listSection}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {([
            { key: 'all', label: `Semua (${reminders.length})` },
            { key: 'bill', label: `Tagihan (${bills.length})` },
            { key: 'subscription', label: `Subscription (${subs.length})` },
          ] as { key: TabType; label: string }[]).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bills */}
        {showBills && bills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tagihan</Text>
            {bills.map((r) => (
              <BillCard
                key={r.id}
                reminder={r}
                onMarkPaid={() => handleMarkPaid(r.id, r.name)}
                onDelete={() => handleDelete(r.id, r.name)}
              />
            ))}
          </View>
        )}

        {/* Subscriptions */}
        {showSubs && subs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            {subs.map((r) => (
              <SubCard
                key={r.id}
                reminder={r}
                onMarkPaid={() => handleMarkPaid(r.id, r.name)}
                onDelete={() => handleDelete(r.id, r.name)}
              />
            ))}
          </View>
        )}

        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>Belum ada reminder</Text>
            <Text style={styles.emptyText}>Tekan + untuk menambah tagihan atau subscription</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getDaysLeft(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

function BillCard({ reminder, onMarkPaid, onDelete }: { reminder: ReminderType; onMarkPaid: () => void; onDelete: () => void }) {
  const days = getDaysLeft(reminder.date);

  return (
    <View style={[styles.billCard, reminder.paid && styles.paidCard]}>
      <View style={styles.billCardRow}>
        <View style={[styles.billIconBg, reminder.paid && { backgroundColor: '#DCFCE7' }]}>
          <Ionicons name="flash" size={20} color={reminder.paid ? '#16A34A' : '#CA8A04'} />
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billTitle}>{reminder.name}</Text>
          <Text style={styles.billDue}>Jatuh tempo {reminder.date}</Text>
        </View>
        <View style={styles.billRight}>
          <Text style={styles.billAmount}>{formatRupiah(reminder.amount)}</Text>
          {/* Tombol hapus */}
          <TouchableOpacity onPress={onDelete} style={styles.miniDeleteBtn}>
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.billFooter}>
        {reminder.paid ? (
          <View style={styles.paidBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={styles.paidBadgeText}>Sudah Dibayar</Text>
          </View>
        ) : (
          <View style={styles.daysLeftBadge}>
            <View style={styles.daysLeftDot} />
            <Text style={styles.daysLeftText}>{Math.max(0, days)} hari lagi</Text>
          </View>
        )}

        {!reminder.paid && (
          <TouchableOpacity onPress={onMarkPaid} style={styles.markPaidBtnSmall}>
            <Ionicons name="checkmark-circle-outline" size={15} color={Colors.primaryDeep} />
            <Text style={styles.markPaidBtnSmallText}>Tandai Sudah Dibayar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function SubCard({ reminder, onMarkPaid, onDelete }: { reminder: ReminderType; onMarkPaid: () => void; onDelete: () => void }) {
  const days = getDaysLeft(reminder.date);
  const colorMap: Record<string, string> = {
    Netflix: '#DC2626', Spotify: '#16A34A', Vidio: '#DC2626',
    Youtube: '#DC2626', ChatGPT: '#059669',
  };
  const color = reminder.paid ? '#9CA3AF' : (colorMap[reminder.category] || Colors.primaryDeep);

  return (
    <View style={[styles.subCard, reminder.paid && styles.paidCard]}>
      <View style={[styles.subHeader, { backgroundColor: color }]}>
        {/* Tombol hapus di pojok */}
        <TouchableOpacity onPress={onDelete} style={styles.subDeleteBtn}>
          <Ionicons name="trash-outline" size={18} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <View style={styles.subIconCircle}>
          <Text style={[styles.subIconText, { color }]}>{reminder.name[0]}</Text>
        </View>
        <Text style={styles.subTitle}>{reminder.name}</Text>
        <Text style={styles.subCat}>{reminder.category}</Text>
        <View style={styles.subAmountBox}>
          <Text style={styles.subAmountLabel}>Jumlah Tagihan</Text>
          <Text style={styles.subAmount}>{formatRupiah(reminder.amount)}</Text>
        </View>
      </View>

      <View style={styles.subBody}>
        {/* Status */}
        <View style={[styles.subRow, { backgroundColor: reminder.paid ? '#F0FDF4' : '#FFF7ED', borderColor: reminder.paid ? '#DCFCE7' : '#FED7AA' }]}>
          <Ionicons name={reminder.paid ? 'checkmark-circle' : 'time-outline'} size={16} color={reminder.paid ? '#16A34A' : '#F97316'} />
          <Text style={[styles.subRowLabel, { color: reminder.paid ? '#16A34A' : '#F97316', fontWeight: '700' }]}>
            {reminder.paid ? 'Sudah Dibayar ✓' : `${Math.max(0, days)} hari lagi`}
          </Text>
        </View>

        <View style={styles.subRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.primaryDeep} />
          <Text style={styles.subRowLabel}>Tanggal Jatuh Tempo</Text>
          <Text style={styles.subRowValue}>{reminder.date}</Text>
        </View>
        <View style={styles.subRow}>
          <Ionicons name="notifications-outline" size={16} color="#3B82F6" />
          <Text style={styles.subRowLabel}>Pengingat</Text>
          <Text style={styles.subRowValue}>{reminder.reminderTime} hari sebelum</Text>
        </View>
        <View style={styles.subRow}>
          <Ionicons name="repeat-outline" size={16} color="#EC4899" />
          <Text style={styles.subRowLabel}>Tagihan Berulang</Text>
          <Text style={[styles.subRowValue, { color: Colors.primaryDeep }]}>Bulanan</Text>
        </View>

        {/* Tombol Tandai Sudah Dibayar */}
        {reminder.paid ? (
          <View style={styles.paidFullBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.paidFullText}>Sudah Ditandai Dibayar</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.paidBtn} onPress={onMarkPaid}>
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
            <Text style={styles.paidBtnText}>Tandai Sudah Dibayar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  purpleSection: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 30, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  addBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 24, padding: 20 },
  sumLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 6, fontWeight: '500' },
  sumValue: { fontSize: 28, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  sumSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginBottom: 10 },
  sumBar: { height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' },
  sumBarFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 4 },

  listSection: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 },

  tabs: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: 18, padding: 6, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    borderWidth: 1, borderColor: Colors.gray100,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 11, fontWeight: '500', color: Colors.gray500 },
  tabTextActive: { color: Colors.white, fontWeight: '700' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12, marginLeft: 4 },

  // Bill Card
  billCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    borderWidth: 1, borderColor: Colors.gray100, gap: 12,
  },
  paidCard: { opacity: 0.75, borderColor: '#DCFCE7' },
  billCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  billIconBg: { width: 40, height: 40, backgroundColor: '#FEF9C3', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  billInfo: { flex: 1 },
  billTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  billDue: { fontSize: 11, color: Colors.gray400, marginTop: 2 },
  billRight: { alignItems: 'flex-end', gap: 6 },
  billAmount: { fontSize: 13, fontWeight: '700', color: Colors.text },
  miniDeleteBtn: { padding: 4 },
  billFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.gray50 },
  daysLeftBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  daysLeftDot: { width: 6, height: 6, backgroundColor: Colors.expense, borderRadius: 3 },
  daysLeftText: { fontSize: 11, fontWeight: '500', color: Colors.expense },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  paidBadgeText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },
  markPaidBtnSmall: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  markPaidBtnSmallText: { fontSize: 12, fontWeight: '700', color: Colors.primaryDeep },

  // Sub Card
  subCard: {
    backgroundColor: Colors.white, borderRadius: 24, marginBottom: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  subHeader: { padding: 24, paddingBottom: 32, alignItems: 'center' },
  subDeleteBtn: { position: 'absolute', top: 16, right: 16 },
  subIconCircle: { width: 56, height: 56, backgroundColor: Colors.white, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  subIconText: { fontSize: 24, fontWeight: '700' },
  subTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  subCat: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 16, fontWeight: '500' },
  subAmountBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 10, alignItems: 'center' },
  subAmountLabel: { fontSize: 9, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  subAmount: { fontSize: 18, fontWeight: '700', color: Colors.white },
  subBody: { padding: 20, marginTop: -16, backgroundColor: Colors.white, borderRadius: 24, gap: 10 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: Colors.gray100, borderRadius: 14 },
  subRowLabel: { flex: 1, fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  subRowValue: { fontSize: 12, fontWeight: '700', color: Colors.text },

  paidBtn: {
    backgroundColor: Colors.primaryDeep, borderRadius: 14, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 4, shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  paidBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  paidFullBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, backgroundColor: '#F0FDF4', borderRadius: 14, marginTop: 4 },
  paidFullText: { fontSize: 14, fontWeight: '700', color: '#16A34A' },

  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  emptyText: { fontSize: 13, color: Colors.gray400, textAlign: 'center' },
});
