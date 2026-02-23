import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

interface ProfileProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Profile({ isDarkMode, onToggleDarkMode }: ProfileProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />
        <Text style={styles.headerTitle}>Profil Saya</Text>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={40} color={Colors.primaryDeep} />
            </View>
          </View>
          <TouchableOpacity style={styles.avatarEdit}>
            <Ionicons name="settings-outline" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Ahmad Nazar</Text>
        <Text style={styles.email}>ahmad.nazar@example.com</Text>
      </View>

      <View style={styles.content}>
        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Saldo</Text>
            <Text style={styles.statValue}>Rp 32.5jt</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pengeluaran</Text>
            <Text style={[styles.statValue, { color: Colors.expense }]}>Rp 4.2jt</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pemasukan</Text>
            <Text style={[styles.statValue, { color: Colors.income }]}>Rp 8.5jt</Text>
          </View>
        </View>

        {/* Akun */}
        <Text style={styles.sectionTitle}>Akun</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Edit Profil" />
          <MenuItem icon="shield-outline" label="Keamanan" />
          <MenuItem icon="card-outline" label="Kartu & Rekening" isLast />
        </View>

        {/* Preferensi */}
        <Text style={styles.sectionTitle}>Preferensi</Text>
        <View style={styles.menuCard}>
          <View style={styles.darkModeRow}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name={isDarkMode ? 'moon-outline' : 'sunny-outline'} size={18} color={Colors.gray500} />
              </View>
              <Text style={styles.menuLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={onToggleDarkMode}
              trackColor={{ false: Colors.gray200, true: Colors.primaryDeep }}
              thumbColor={Colors.white}
            />
          </View>
          <MenuItem icon="notifications-outline" label="Notifikasi" />
          <MenuItem icon="location-outline" label="Lokasi" />
          <MenuItem icon="settings-outline" label="Pengaturan Lainnya" isLast />
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={Colors.expense} />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versi Aplikasi 1.0.2</Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, label, isLast }: { icon: any; label: string; isLast?: boolean }) {
  return (
    <TouchableOpacity style={[styles.menuItem, !isLast && styles.menuItemBorder]}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={18} color={Colors.gray500} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    backgroundColor: Colors.primaryDeep,
    paddingTop: 48, paddingBottom: 40,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10,
  },
  headerDecor1: {
    position: 'absolute', top: -128, right: -128,
    width: 256, height: 256, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 128,
  },
  headerDecor2: {
    position: 'absolute', bottom: -80, left: -80,
    width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 80,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 96, height: 96, backgroundColor: Colors.white,
    borderRadius: 48, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  avatarInner: {
    flex: 1, backgroundColor: Colors.purple100,
    borderRadius: 44, alignItems: 'center', justifyContent: 'center',
  },
  avatarEdit: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, backgroundColor: Colors.primary,
    borderRadius: 16, borderWidth: 2, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 22, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },

  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },

  statsCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 16,
    flexDirection: 'row', borderWidth: 1, borderColor: Colors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
    marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: Colors.gray400, fontWeight: '500', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
  statDivider: { width: 1, backgroundColor: Colors.gray100 },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 10, marginLeft: 4 },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    marginBottom: 20,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray50 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 34, height: 34, backgroundColor: Colors.gray50,
    borderRadius: 17, alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { fontSize: 14, fontWeight: '500', color: Colors.gray600 },
  darkModeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray50,
  },

  logoutBtn: {
    backgroundColor: Colors.expenseBg, borderRadius: 20, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 20,
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: Colors.expense },
  version: { textAlign: 'center', fontSize: 11, color: Colors.gray400, marginBottom: 20 },
});

// Extra colors
const extra = { purple100: '#F3E8FF' };
Object.assign(Colors, extra);
