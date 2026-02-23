import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

interface AddGoalProps {
  onClose: () => void;
  onSave: (goal: any) => void;
}

const CATEGORIES = [
  { id: 'Travel', name: 'Travel', icon: '✈️', color: Colors.blue500 },
  { id: 'Dana Darurat', name: 'Dana Darurat', icon: '🛡️', color: Colors.indigo500 },
  { id: 'Wedding', name: 'Wedding', icon: '💍', color: Colors.pink500 },
  { id: 'Gadget', name: 'Gadget', icon: '📱', color: Colors.cyan500 },
  { id: 'Bisnis', name: 'Bisnis', icon: '💼', color: Colors.orange500 },
  { id: 'Kendaraan', name: 'Kendaraan', icon: '🚗', color: Colors.red500 },
  { id: 'Pendidikan', name: 'Pendidikan', icon: '🎓', color: Colors.green500 },
  { id: 'Rumah', name: 'Rumah', icon: '🏠', color: Colors.teal500 },
];

const GOAL_ICON_MAP: Record<string, string> = {
  Travel: '✈️', 'Dana Darurat': '🛡️', Wedding: '💍',
  Gadget: '📱', Bisnis: '💼', Kendaraan: '🚗',
  Pendidikan: '🎓', Rumah: '🏠',
};

export function AddGoal({ onClose, onSave }: AddGoalProps) {
  const [category, setCategory] = useState('Travel');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave({
      category,
      title: note || category,
      targetAmount: parseInt(targetAmount) || 0,
      monthlyAmount: parseInt(monthlyAmount) || 0,
      currentAmount: 0,
      note,
      createdAt: new Date().toISOString(),
      targetDate: 'TBD',
      icon: GOAL_ICON_MAP[category] || '🎯',
    });
    onClose();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Tambah Goals</Text>
          <Text style={styles.headerSub}>Wujudkan Impian Anda</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Category */}
        <Text style={styles.fieldLabel}>Kategori</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.catItem, category === cat.id && styles.catItemActive]}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catName, category === cat.id && styles.catNameActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Target Amount */}
        <Text style={styles.fieldLabel}>Jumlah Target</Text>
        <TextInput
          style={styles.input}
          placeholder="Rp 0"
          placeholderTextColor={Colors.gray400}
          keyboardType="numeric"
          value={targetAmount}
          onChangeText={setTargetAmount}
        />

        {/* Monthly Amount */}
        <Text style={styles.fieldLabel}>Target Nabung per Bulan</Text>
        <TextInput
          style={styles.input}
          placeholder="Rp 0"
          placeholderTextColor={Colors.gray400}
          keyboardType="numeric"
          value={monthlyAmount}
          onChangeText={setMonthlyAmount}
        />

        {/* Notes */}
        <Text style={styles.fieldLabel}>Catatan</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Contoh: Iphone 17 Pro Hadiah Ulang Tahun"
          placeholderTextColor={Colors.gray400}
          multiline
          numberOfLines={3}
          value={note}
          onChangeText={setNote}
        />

        {/* Tips */}
        <View style={styles.tipsBox}>
          <Ionicons name="bulb-outline" size={22} color={Colors.primary} />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Tips Mencapai Goals</Text>
            <Text style={styles.tipsText}>
              Sisihkan uang anda setelah terima gaji tiap bulan. Konsisten adalah kunci untuk mencapai target anda!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    backgroundColor: Colors.primary,
    padding: 24, paddingBottom: 32,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  headerText: {},
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, padding: 8,
  },

  form: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.gray500,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 16,
  },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: {
    width: '22%', alignItems: 'center', padding: 12,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.gray200,
    backgroundColor: Colors.white, aspectRatio: 1, justifyContent: 'center',
  },
  catItemActive: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: Colors.white },
  catIcon: { fontSize: 22, marginBottom: 6 },
  catName: { fontSize: 9, fontWeight: '700', color: Colors.gray500, textAlign: 'center' },
  catNameActive: { color: Colors.text },

  input: {
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.gray200,
    borderRadius: 14, padding: 16,
    fontSize: 14, fontWeight: '500', color: Colors.text,
    marginBottom: 4,
  },
  textarea: { height: 80, textAlignVertical: 'top' },

  tipsBox: {
    backgroundColor: Colors.purple50,
    borderWidth: 1, borderColor: Colors.purple100,
    borderRadius: 14, padding: 16,
    flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 24,
  },
  tipsContent: { flex: 1 },
  tipsTitle: { fontSize: 11, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  tipsText: { fontSize: 10, color: Colors.primaryDeep, lineHeight: 16 },

  footer: {
    flexDirection: 'row', padding: 24, gap: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.gray100,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.gray200, alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '700', color: Colors.gray600 },
  saveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  saveText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});

// Extra colors referenced
const extra = { cyan500: '#06B6D4', indigo500: '#6366F1', pink500: '#EC4899', teal500: '#14B8A6', orange500: '#F97316', red500: '#EF4444', green500: '#22C55E', blue500: '#3B82F6', purple100: '#F3E8FF', purple50: '#FAF5FF' };
Object.assign(Colors, extra);
