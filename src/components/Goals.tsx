import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';
import { Goal } from '../hooks/useGoals';
import { formatRupiah } from '../utils';

interface GoalsProps {
  goals: Goal[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
  onAddSavings: (id: string, amount: number) => void;
}

const GOAL_COLORS: Record<string, string> = {
  Travel: '#F97316', 'Dana Darurat': '#22C55E', Wedding: '#EC4899',
  Gadget: '#3B82F6', Bisnis: '#F97316', Kendaraan: '#EF4444',
  Pendidikan: '#22C55E', Rumah: '#14B8A6',
};

export function Goals({ goals, onAddClick, onDelete, onAddSavings }: GoalsProps) {
  const [savingsModal, setSavingsModal] = useState<{ visible: boolean; goalId: string; goalTitle: string }>({
    visible: false, goalId: '', goalTitle: '',
  });
  const [savingsInput, setSavingsInput] = useState('');

  const totalProgress =
    goals.length === 0
      ? 0
      : Math.round(
          (goals.reduce((acc, g) => acc + Math.min(g.currentAmount / g.targetAmount, 1), 0) / goals.length) * 100
        );
  const totalCurrent = goals.reduce((a, g) => a + g.currentAmount, 0);
  const totalTarget = goals.reduce((a, g) => a + g.targetAmount, 0);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Hapus Goal',
      `Yakin ingin menghapus "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  const handleAddSavings = () => {
    const amount = parseInt(savingsInput.replace(/\D/g, ''));
    if (!amount || amount <= 0) {
      Alert.alert('Input tidak valid', 'Masukkan jumlah yang benar');
      return;
    }
    onAddSavings(savingsModal.goalId, amount);
    setSavingsModal({ visible: false, goalId: '', goalTitle: '' });
    setSavingsInput('');
    Alert.alert('Berhasil! 🎉', `Tabungan sebesar ${formatRupiah(amount)} berhasil ditambahkan`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* PURPLE SECTION */}
      <View style={styles.purpleSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Goals</Text>
            <Text style={styles.subtitle}>Wujudkan Impian Anda</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={onAddClick}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.mainCardRow}>
            <View>
              <Text style={styles.mainCardLabel}>Total Progress</Text>
              <Text style={styles.mainCardPct}>{totalProgress}%</Text>
            </View>
            <View style={styles.targetIcon}>
              <Text style={{ fontSize: 24 }}>🎯</Text>
            </View>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${totalProgress}%` as any }]} />
          </View>
          <View style={styles.mainCardFooter}>
            <Text style={styles.mainCardFooterText}>Terkumpul: {formatRupiah(totalCurrent)}</Text>
            <Text style={styles.mainCardFooterText}>Target: {formatRupiah(totalTarget)}</Text>
          </View>
        </View>
      </View>

      {/* LIST SECTION */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Target Saya ({goals.length})</Text>
        </View>

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>Belum ada target tabungan</Text>
          </View>
        ) : (
          goals.map((goal) => {
            const progress = Math.round(Math.min(goal.currentAmount / goal.targetAmount, 1) * 100);
            const color = GOAL_COLORS[goal.category] || Colors.primaryDeep;
            return (
              <View key={goal.id} style={styles.goalCard}>
                {/* Goal Header Row */}
                <View style={styles.goalCardRow}>
                  <View style={styles.goalIcon}>
                    <Text style={{ fontSize: 24 }}>{goal.icon}</Text>
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle} numberOfLines={2}>{goal.title}</Text>
                    <Text style={styles.goalCategory}>{goal.category}</Text>
                  </View>
                  {/* Tombol hapus */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(goal.id, goal.title)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={[styles.progressPct, { color: Colors.primaryDeep }]}>{progress}%</Text>
                </View>
                <View style={styles.progressBgSmall}>
                  <View style={[styles.progressFillSmall, { width: `${progress}%` as any, backgroundColor: color }]} />
                </View>

                {/* Amount */}
                <View style={styles.amountRow}>
                  <View>
                    <Text style={styles.amountLabel}>Terkumpul</Text>
                    <Text style={styles.amountValue}>{formatRupiah(goal.currentAmount)}</Text>
                  </View>
                  <View style={styles.amountRight}>
                    <Text style={styles.amountLabel}>Target</Text>
                    <Text style={styles.amountValue}>{formatRupiah(goal.targetAmount)}</Text>
                  </View>
                </View>

                {/* Meta */}
                {goal.targetDate && (
                  <View style={styles.metaRow}>
                    <View style={styles.metaDate}>
                      <Text style={styles.metaText}>📅 {goal.targetDate}</Text>
                    </View>
                    <View style={styles.metaDays}>
                      <Text style={[styles.metaText, { color: Colors.primaryDeep }]}>
                        {progress >= 100 ? '✅ Tercapai!' : `⏳ ${goal.monthlyAmount > 0 ? Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyAmount) : '?'} bln lagi`}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Tombol Tambah Tabungan */}
                {progress < 100 ? (
                  <TouchableOpacity
                    style={styles.addSavingsBtn}
                    onPress={() => {
                      setSavingsModal({ visible: true, goalId: goal.id, goalTitle: goal.title });
                      setSavingsInput('');
                    }}
                  >
                    <Ionicons name="add" size={16} color={Colors.white} />
                    <Text style={styles.addSavingsBtnText}>Tambah Tabungan</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                    <Text style={styles.completedText}>Goal Tercapai! 🎉</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Modal Tambah Tabungan */}
      <Modal visible={savingsModal.visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSavingsModal({ visible: false, goalId: '', goalTitle: '' })}
        >
          <View style={styles.savingsModal}>
            <Text style={styles.savingsModalTitle}>Tambah Tabungan</Text>
            <Text style={styles.savingsModalGoal} numberOfLines={1}>{savingsModal.goalTitle}</Text>

            <Text style={styles.savingsLabel}>Jumlah yang ingin ditabung</Text>
            <TextInput
              style={styles.savingsInput}
              placeholder="Rp 0"
              placeholderTextColor={Colors.gray400}
              keyboardType="numeric"
              value={savingsInput}
              onChangeText={setSavingsInput}
              autoFocus
            />

            <View style={styles.savingsActions}>
              <TouchableOpacity
                style={styles.savingsCancelBtn}
                onPress={() => setSavingsModal({ visible: false, goalId: '', goalTitle: '' })}
              >
                <Text style={styles.savingsCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.savingsConfirmBtn} onPress={handleAddSavings}>
                <Text style={styles.savingsConfirmText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  purpleSection: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
    paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 30, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  addBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  mainCard: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  mainCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  mainCardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  mainCardPct: { fontSize: 36, fontWeight: '700', color: Colors.white },
  targetIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8 },
  progressBg: { height: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 8 },
  mainCardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  mainCardFooterText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

  listSection: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginLeft: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  listTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },

  goalCard: {
    backgroundColor: Colors.white, borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    borderWidth: 1, borderColor: Colors.gray100,
  },
  goalCardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  goalIcon: { width: 48, height: 48, backgroundColor: Colors.gray50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  goalInfo: { flex: 1 },
  goalTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 4, lineHeight: 18 },
  goalCategory: { fontSize: 11, color: Colors.gray400, fontWeight: '500' },
  deleteBtn: { padding: 6, backgroundColor: '#FEF2F2', borderRadius: 10 },

  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray400 },
  progressPct: { fontSize: 11, fontWeight: '700' },
  progressBgSmall: { height: 10, backgroundColor: Colors.gray100, borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  progressFillSmall: { height: '100%', borderRadius: 8 },

  amountRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.gray50, borderRadius: 14, padding: 12, marginBottom: 16 },
  amountRight: { alignItems: 'flex-end' },
  amountLabel: { fontSize: 10, color: Colors.gray400, marginBottom: 2 },
  amountValue: { fontSize: 13, fontWeight: '700', color: Colors.text },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metaDate: { backgroundColor: Colors.gray50, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  metaDays: { backgroundColor: '#FAF5FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  metaText: { fontSize: 11, color: Colors.gray500, fontWeight: '500' },

  addSavingsBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  addSavingsBtnText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#F0FDF4', borderRadius: 14 },
  completedText: { fontSize: 13, fontWeight: '700', color: '#22C55E' },

  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  emptyText: { textAlign: 'center', color: Colors.gray400, marginTop: 20 },

  // Modal Tabungan
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  savingsModal: {
    backgroundColor: Colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 28, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10,
  },
  savingsModalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  savingsModalGoal: { fontSize: 13, color: Colors.gray400, textAlign: 'center', marginBottom: 24 },
  savingsLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  savingsInput: {
    backgroundColor: Colors.gray50, borderWidth: 1, borderColor: Colors.gray200,
    borderRadius: 14, padding: 16, fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 24,
  },
  savingsActions: { flexDirection: 'row', gap: 12 },
  savingsCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.gray200, alignItems: 'center' },
  savingsCancelText: { fontSize: 14, fontWeight: '700', color: Colors.gray600 },
  savingsConfirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center' },
  savingsConfirmText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
