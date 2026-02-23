import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

interface AddReminderProps {
  onClose: () => void;
  onSave: (reminder: any) => void;
}

const SUBSCRIPTION_CATS = [
  { id: 'Netflix', name: 'Netflix', color: '#DC2626' },
  { id: 'Spotify', name: 'Spotify', color: '#16A34A' },
  { id: 'Vidio', name: 'Vidio', color: '#DC2626' },
  { id: 'Youtube', name: 'YouTube', color: '#DC2626' },
  { id: 'ChatGPT', name: 'ChatGPT', color: '#059669' },
];

export function AddReminder({ onClose, onSave }: AddReminderProps) {
  const [type, setType] = useState<'bill' | 'subscription'>('subscription');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Spotify');
  const [reminderTime, setReminderTime] = useState('1');

  const handleSave = () => {
    onSave({ type, name, amount: parseInt(amount) || 0, date, category, reminderTime });
    onClose();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Tambah Reminder</Text>
            <Text style={styles.headerSub}>Buat pengingat tagihan baru</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'bill' && styles.typeBtnActive]}
            onPress={() => setType('bill')}
          >
            <Ionicons name="receipt-outline" size={16} color={type === 'bill' ? Colors.primaryDeep : 'rgba(255,255,255,0.7)'} />
            <Text style={[styles.typeBtnText, type === 'bill' && styles.typeBtnTextActive]}>Tagihan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'subscription' && styles.typeBtnActive]}
            onPress={() => setType('subscription')}
          >
            <Ionicons name="calendar-outline" size={16} color={type === 'subscription' ? Colors.primaryDeep : 'rgba(255,255,255,0.7)'} />
            <Text style={[styles.typeBtnText, type === 'subscription' && styles.typeBtnTextActive]}>Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <Text style={styles.label}>{type === 'bill' ? 'Nama Tagihan' : 'Nama Subscription'}</Text>
        <TextInput
          style={styles.input}
          placeholder={type === 'bill' ? 'Contoh: Listrik Bulan Ini' : 'Contoh: Spotify'}
          placeholderTextColor={Colors.gray400}
          value={name}
          onChangeText={setName}
        />

        {/* Category (subscription only) */}
        {type === 'subscription' && (
          <>
            <Text style={styles.label}>Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {SUBSCRIPTION_CATS.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, category === cat.id && styles.catChipActive]}
                  onPress={() => setCategory(cat.id)}
                >
                  <View style={[styles.catDot, { backgroundColor: cat.color }]}>
                    <Text style={styles.catDotText}>{cat.name[0]}</Text>
                  </View>
                  <Text style={[styles.catChipText, category === cat.id && styles.catChipTextActive]}>
                    {cat.name}
                  </Text>
                  {category === cat.id && (
                    <Ionicons name="checkmark" size={14} color={Colors.primaryDeep} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Amount */}
        <Text style={styles.label}>Jumlah Tagihan</Text>
        <TextInput
          style={styles.input}
          placeholder="Rp 0"
          placeholderTextColor={Colors.gray400}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Date */}
        <Text style={styles.label}>Tanggal Jatuh Tempo</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.gray400}
          value={date}
          onChangeText={setDate}
        />

        {/* Reminder Time */}
        <Text style={styles.label}>Ingatkan Sebelum</Text>
        <View style={styles.reminderOptions}>
          {[
            { val: '1', label: '1 Hari' },
            { val: '3', label: '3 Hari' },
            { val: '7', label: '7 Hari' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.val}
              style={[styles.reminderOpt, reminderTime === opt.val && styles.reminderOptActive]}
              onPress={() => setReminderTime(opt.val)}
            >
              <Text style={[styles.reminderOptText, reminderTime === opt.val && styles.reminderOptTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
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
    backgroundColor: Colors.primaryDeep,
    padding: 24, paddingBottom: 28,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  closeBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8 },

  typeToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 4, gap: 4 },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 12,
  },
  typeBtnActive: { backgroundColor: Colors.white },
  typeBtnText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  typeBtnTextActive: { color: Colors.primaryDeep },

  form: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  label: {
    fontSize: 11, fontWeight: '700', color: Colors.gray500,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 16,
  },
  input: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray200,
    borderRadius: 14, padding: 16, fontSize: 14, fontWeight: '500', color: Colors.text,
  },

  catScroll: { marginBottom: 4 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.gray200, backgroundColor: Colors.white, marginRight: 10,
  },
  catChipActive: { borderColor: Colors.primaryDeep, borderWidth: 2 },
  catDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catDotText: { fontSize: 9, color: Colors.white, fontWeight: '700' },
  catChipText: { fontSize: 12, fontWeight: '700', color: Colors.gray500 },
  catChipTextActive: { color: Colors.text },

  reminderOptions: { flexDirection: 'row', gap: 10 },
  reminderOpt: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.gray200, backgroundColor: Colors.white, alignItems: 'center',
  },
  reminderOptActive: { backgroundColor: Colors.purple50, borderColor: Colors.primaryDeep, borderWidth: 2 },
  reminderOptText: { fontSize: 13, fontWeight: '600', color: Colors.gray500 },
  reminderOptTextActive: { color: Colors.primaryDeep, fontWeight: '700' },

  footer: {
    flexDirection: 'row', padding: 24, gap: 16,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray100,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.gray200, alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '700', color: Colors.gray600 },
  saveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: Colors.primaryDeep, alignItems: 'center',
    shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  saveText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});

const extra = { purple50: '#FAF5FF' };
Object.assign(Colors, extra);
