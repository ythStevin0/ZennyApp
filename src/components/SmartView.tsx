import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '../utils/colors';
import { Transaction } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = SCREEN_W - 80;
const CHART_H = 140;
const BAR_W = 40;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

function HeatmapColor(level: number) {
  switch (level) {
    case 1: return '#BBF7D0';
    case 2: return '#FDE047';
    case 3: return '#F87171';
    default: return Colors.gray100;
  }
}

export function SmartView({ transactions }: { transactions: Transaction[] }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const monthTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const weeklyData = React.useMemo(() => {
    if (monthTransactions.length === 0) {
      return [
        { name: 'Minggu 1', value: 0 },
        { name: 'Minggu 2', value: 0 },
        { name: 'Minggu 3', value: 0 },
        { name: 'Minggu 4', value: 0 },
      ];
    }

    const weeks = [0, 0, 0, 0];

    monthTransactions.forEach((t) => {
      if (t.type !== 'expense') return;

      const day = new Date(t.date).getDate();
      const weekIndex = Math.min(3, Math.floor((day - 1) / 7));
      weeks[weekIndex] += t.amount;
    });

    return weeks.map((v, i) => ({
      name: `Minggu ${i + 1}`,
      value: v,
    }));
  }, [monthTransactions]);

  const heatmap = React.useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      level: 0,
    }));

    monthTransactions.forEach((t) => {
      if (t.type !== 'expense') return;

      const day = new Date(t.date).getDate() - 1;
      const amt = t.amount;

      if (amt < 20000) days[day].level = 1;
      else if (amt < 100000) days[day].level = 2;
      else days[day].level = 3;
    });

    return days;
  }, [monthTransactions]);

  const MAX_VAL = Math.max(...weeklyData.map(d => d.value), 1);
  const GAP = (CHART_W - weeklyData.length * BAR_W) / (weeklyData.length + 1);

  // Calculate top expenses from real data
  const topExpenses = React.useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const sorted = Object.entries(categoryTotals)
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    const colors = ['#EF4444', '#3B82F6', '#F97316'];
    return sorted.map((e, i) => ({ ...e, color: colors[i] || '#9CA3AF' }));
  }, [monthTransactions]);

  const topTotal = topExpenses.reduce((a, e) => a + e.amount, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header — pemilihan bulan */}
      <TouchableOpacity style={styles.headerRow} onPress={() => setShowMonthPicker(true)}>
        <Text style={styles.headerTitle}>{MONTHS[selectedMonth]}</Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      {/* Modal Pilih Bulan */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
          <View style={styles.monthPicker}>
            <Text style={styles.monthPickerTitle}>Pilih Bulan</Text>
            <View style={styles.monthGrid}>
              {MONTHS.map((m, index) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthItem, selectedMonth === index && styles.monthItemActive]}
                  onPress={() => { setSelectedMonth(index); setShowMonthPicker(false); }}
                >
                  <Text style={[styles.monthItemText, selectedMonth === index && styles.monthItemTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Heatmap */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Spending Heatmap</Text>
        <View style={styles.heatmapDays}>
          {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
            <Text key={i} style={styles.heatmapDayLabel}>{d}</Text>
          ))}
        </View>
        <View style={styles.heatmapGrid}>
          {heatmap.map((d) => (
            <View key={d.day} style={[styles.heatmapCell, { backgroundColor: HeatmapColor(d.level) }]}>
              <Text style={[styles.heatmapCellText, { color: d.level > 0 ? Colors.gray700 : Colors.gray300 }]}>
                {d.day}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          {[{ color: '#BBF7D0', label: 'Rendah' }, { color: '#FDE047', label: 'Sedang' }, { color: '#F87171', label: 'Tinggi' }].map((l) => (
            <View key={l.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: l.color }]} />
              <Text style={styles.legendText}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bar Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Grafik Pengeluaran Bulanan</Text>
        <Svg width={CHART_W} height={CHART_H + 30}>
          {weeklyData.map((d, i) => {
            const barH = MAX_VAL > 0 ? (d.value / MAX_VAL) * CHART_H : 0;
            const x = GAP + i * (BAR_W + GAP);
            const y = CHART_H - barH;
            return (
              <React.Fragment key={d.name}>
                <Rect x={x} y={y} width={BAR_W} height={barH} rx={6} fill="#A78BFA" />
                <SvgText x={x + BAR_W / 2} y={CHART_H + 18} fontSize={9} fill={Colors.gray400} textAnchor="middle">
                  {d.name}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
        <Text style={styles.chartLabel}>Pengeluaran {MONTHS[selectedMonth]} {new Date().getFullYear()}</Text>
      </View>

      {/* Top Expenses */}
      <View style={[styles.card, { marginBottom: 100 }]}>
        <View style={styles.topExpHeader}>
          <Text style={styles.cardTitle}>🕒 Pengeluaran Terbanyak</Text>
        </View>
        {topExpenses.length > 0 ? (
          topExpenses.map((e) => (
            <ExpenseBar
              key={e.label}
              label={e.label}
              amount={`Rp ${e.amount.toLocaleString('id-ID')}`}
              percentage={topTotal > 0 ? Math.round((e.amount / topTotal) * 100) : 0}
              color={e.color}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Belum ada pengeluaran bulan ini</Text>
        )}
      </View>

    </ScrollView>
  );
}

function ExpenseBar({ label, amount, percentage, color }: { label: string; amount: string; percentage: number; color: string }) {
  return (
    <View style={styles.expenseBarWrapper}>
      <View style={styles.expenseBarHeader}>
        <View style={styles.expenseBarLabelRow}>
          <View style={[styles.expenseBarDot, { backgroundColor: color }]} />
          <Text style={styles.expenseBarLabel}>{label}</Text>
        </View>
        <View style={styles.expenseBarRight}>
          <Text style={styles.expenseBarAmount}>{amount}</Text>
          <Text style={styles.expenseBarPct}>{percentage}%</Text>
        </View>
      </View>
      <View style={styles.expenseBarBg}>
        <View style={[styles.expenseBarFill, { width: `${percentage}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50, padding: 24 },

  headerRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 6, marginBottom: 24, alignSelf: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  chevron: { fontSize: 12, color: Colors.gray500 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  monthPicker: {
    backgroundColor: Colors.white, borderRadius: 24,
    padding: 24, width: SCREEN_W - 48,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10,
  },
  monthPickerTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 20 },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  monthItem: {
    width: '30%', paddingVertical: 12, borderRadius: 14,
    backgroundColor: Colors.gray50, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.gray100,
  },
  monthItemActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  monthItemText: { fontSize: 13, fontWeight: '600', color: Colors.gray600 },
  monthItemTextActive: { color: Colors.white, fontWeight: '700' },

  card: {
    backgroundColor: Colors.white, borderRadius: 24, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 16 },

  heatmapDays: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  heatmapDayLabel: { fontSize: 9, color: Colors.gray400, fontWeight: '500', width: 28, textAlign: 'center' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatmapCell: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  heatmapCellText: { fontSize: 9, fontWeight: '500' },
  legendRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 9, color: Colors.gray500 },

  chartLabel: { textAlign: 'center', fontSize: 11, color: Colors.primaryDeep, fontWeight: '500', marginTop: 8 },

  topExpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },

  expenseBarWrapper: { marginBottom: 16 },
  expenseBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  expenseBarLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expenseBarDot: { width: 8, height: 8, borderRadius: 2 },
  expenseBarLabel: { fontSize: 11, fontWeight: '500', color: Colors.gray700 },
  expenseBarRight: { alignItems: 'flex-end' },
  expenseBarAmount: { fontSize: 11, fontWeight: '700', color: Colors.text },
  expenseBarPct: { fontSize: 9, color: Colors.gray400 },
  expenseBarBg: { height: 8, backgroundColor: Colors.gray100, borderRadius: 8, overflow: 'hidden' },
  expenseBarFill: { height: '100%', borderRadius: 8 },
  
  emptyText: { fontSize: 13, color: Colors.gray400, textAlign: 'center', paddingVertical: 20 },
});
