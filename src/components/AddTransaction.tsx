import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, TransactionType } from '../types';
import { getCategoryIcon } from '../utils';
import { Colors } from '../utils/colors';

interface AddTransactionProps {
  onAdd: (transaction: any) => void;
  onCancel: () => void;
}

export function AddTransaction({ onAdd, onCancel }: AddTransactionProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleNumberClick = (num: string) => {
    setAmount((prev) => (prev === '0' ? num : prev + num));
  };
  const handleDelete = () => {
    setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleSubmit = () => {
    if (amount === '0' || !category) return;
    onAdd({
      id: Date.now().toString(),
      type,
      amount: parseInt(amount, 10),
      category,
      date: new Date().toISOString(),
      note,
    });
  };

  const isValid = amount !== '0' && !!category;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.gray600} />
        </TouchableOpacity>

        <View style={styles.typeToggle}>
          <TouchableOpacity
            onPress={() => setType('expense')}
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
          >
            <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextExpense]}>
              Pengeluaran
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('income')}
            style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]}
          >
            <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextIncome]}>
              Pemasukan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: 32 }} />
      </View>

      {/* Category Grid */}
      <ScrollView style={styles.categoryScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Pilih Kategori</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES[type].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.categoryItem, category === cat && styles.categoryItemActive]}
            >
              <View style={[styles.categoryEmojiBg, category === cat && styles.categoryEmojiBgActive]}>
                <Text style={styles.categoryEmoji}>{getCategoryIcon(cat)}</Text>
              </View>
              <Text style={[styles.categoryName, category === cat && styles.categoryNameActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Numpad Area */}
      <View style={styles.numpadArea}>
        {/* Note + Amount */}
        <View style={styles.inputRow}>
          <View style={styles.noteInput}>
            <Text style={styles.noteIcon}>📝</Text>
            <TextInput
              placeholder="Tambahkan Catatan..."
              placeholderTextColor={Colors.gray400}
              style={styles.noteText}
              value={note}
              onChangeText={setNote}
            />
          </View>
          <Text style={[styles.amountDisplay, type === 'income' ? styles.amountIncome : styles.amountExpense]}>
            {parseInt(amount).toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Numpad */}
        <View style={styles.numpad}>
          {/* Row 1 */}
          <View style={styles.numpadRow}>
            {[1, 2, 3].map((n) => <NumBtn key={n} val={n} onPress={() => handleNumberClick(n.toString())} />)}
            <TouchableOpacity style={styles.numBtnSpecial} onPress={handleDelete}>
              <Ionicons name="chevron-back" size={24} color={Colors.gray600} />
            </TouchableOpacity>
          </View>
          {/* Row 2 */}
          <View style={styles.numpadRow}>
            {[4, 5, 6].map((n) => <NumBtn key={n} val={n} onPress={() => handleNumberClick(n.toString())} />)}
            <TouchableOpacity style={styles.numBtnSpecial}>
              <Text style={styles.numBtnSpecialText}>+</Text>
            </TouchableOpacity>
          </View>
          {/* Row 3 */}
          <View style={styles.numpadRow}>
            {[7, 8, 9].map((n) => <NumBtn key={n} val={n} onPress={() => handleNumberClick(n.toString())} />)}
            <TouchableOpacity style={styles.numBtnSpecial}>
              <Text style={styles.numBtnSpecialText}>-</Text>
            </TouchableOpacity>
          </View>
          {/* Row 4 */}
          <View style={styles.numpadRow}>
            <TouchableOpacity style={styles.numBtnSpecial}>
              <Text style={styles.numBtnSpecialText}>,</Text>
            </TouchableOpacity>
            <NumBtn val={0} onPress={() => handleNumberClick('0')} />
            <TouchableOpacity
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={[styles.saveBtnText, !isValid && styles.saveBtnTextDisabled]}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

function NumBtn({ val, onPress }: { val: number; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.numBtn} onPress={onPress}>
      <Text style={styles.numBtnText}>{val}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  closeBtn: { padding: 8, marginLeft: -8, borderRadius: 20 },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 4,
    gap: 2,
  },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  typeBtnActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  typeBtnText: { fontSize: 11, fontWeight: '700', color: Colors.gray500 },
  typeBtnTextExpense: { color: Colors.expense },
  typeBtnTextIncome: { color: Colors.income },

  categoryScroll: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 20 },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  categoryItemActive: {
    backgroundColor: Colors.purple50,
    borderWidth: 2,
    borderColor: Colors.primaryDeep,
    transform: [{ scale: 1.05 }],
  },
  categoryEmojiBg: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center',
  },
  categoryEmojiBgActive: { backgroundColor: Colors.white },
  categoryEmoji: { fontSize: 22 },
  categoryName: { fontSize: 10, fontWeight: '600', color: Colors.gray600, textAlign: 'center' },
  categoryNameActive: { color: Colors.primaryDeep },

  numpadArea: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  noteInput: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  noteIcon: { fontSize: 16 },
  noteText: { flex: 1, fontSize: 13, color: Colors.text, fontWeight: '500' },
  amountDisplay: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  amountIncome: { color: Colors.income },
  amountExpense: { color: Colors.expense },

  numpad: { gap: 10 },
  numpadRow: { flexDirection: 'row', gap: 10 },
  numBtn: {
    flex: 1, padding: 16, borderRadius: 16,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray100,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
  },
  numBtnText: { fontSize: 22, fontWeight: '700', color: Colors.text },
  numBtnSpecial: {
    flex: 1, padding: 16, borderRadius: 16,
    backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center',
  },
  numBtnSpecialText: { fontSize: 20, fontWeight: '700', color: Colors.gray600 },
  saveBtn: {
    flex: 2, padding: 16, borderRadius: 16,
    backgroundColor: Colors.primaryDeep, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  saveBtnDisabled: { backgroundColor: Colors.gray200, shadowOpacity: 0, elevation: 0 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  saveBtnTextDisabled: { color: Colors.gray400 },
});
