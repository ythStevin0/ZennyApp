import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';
import { UserProfile } from '../types';
import { formatRupiah } from '../utils';

interface ProfileProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile;
  onSaveProfile: (user: UserProfile) => void;
  onEditProfileClick: () => void;
  balance: number;
  income: number;
  expense: number;
}

export function Profile({
  isDarkMode, onToggleDarkMode, user, onSaveProfile, onEditProfileClick,
  balance, income, expense,
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<UserProfile>(user);

  React.useEffect(() => {
    setEditUser(user);
  }, [user]);

  const handleSave = () => {
    if (!editUser.name.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return;
    }
    if (!editUser.email.trim()) {
      Alert.alert('Error', 'Email tidak boleh kosong');
      return;
    }
    onSaveProfile(editUser);
    setIsEditing(false);
    Alert.alert('Berhasil', 'Profil berhasil diperbarui');
  };

  const handleCancel = () => {
    setEditUser(user);
    setIsEditing(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onSaveProfile({ ...user, photoUri: result.assets[0].uri });
    }
  };

  if (isEditing) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerDecor1} />
          <View style={styles.headerDecor2} />
          <TouchableOpacity style={styles.backBtn} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profil</Text>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={40} color={Colors.primaryDeep} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={Colors.gray400} />
                <TextInput
                  style={styles.input}
                  value={editUser.name}
                  onChangeText={(text) => setEditUser({ ...editUser, name: text })}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={Colors.gray300}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={Colors.gray400} />
                <TextInput
                  style={styles.input}
                  value={editUser.email}
                  onChangeText={(text) => setEditUser({ ...editUser, email: text })}
                  placeholder="Masukkan email"
                  placeholderTextColor={Colors.gray300}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nomor Telepon</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={18} color={Colors.gray400} />
                <TextInput
                  style={styles.input}
                  value={editUser.phone}
                  onChangeText={(text) => setEditUser({ ...editUser, phone: text })}
                  placeholder="Masukkan nomor telepon"
                  placeholderTextColor={Colors.gray300}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark" size={18} color={Colors.white} />
              <Text style={styles.saveBtnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

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
              {user.photoUri ? (
                <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={40} color={Colors.primaryDeep} />
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.avatarEdit} onPress={pickImage}>
            <Ionicons name="pencil" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
      </View>

      <View style={styles.content}>
        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Saldo</Text>
            <Text style={styles.statValue}>{formatRupiah(balance)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pengeluaran</Text>
            <Text style={[styles.statValue, { color: Colors.expense }]}>{formatRupiah(expense)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pemasukan</Text>
            <Text style={[styles.statValue, { color: Colors.income }]}>{formatRupiah(income)}</Text>
          </View>
        </View>

        {/* Akun */}
        <Text style={styles.sectionTitle}>Akun</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setIsEditing(true)}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name="person-outline" size={18} color={Colors.gray500} />
              </View>
              <Text style={styles.menuLabel}>Edit Profil</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
          </TouchableOpacity>
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
  backBtn: {
    position: 'absolute', top: 48, left: 20,
    width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 96, height: 96, backgroundColor: Colors.white,
    borderRadius: 48, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  avatarInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarEdit: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, backgroundColor: Colors.primary,
    borderRadius: 16, borderWidth: 2, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 22, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  phone: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },

  // Form styles
  formCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: Colors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: 12,
    paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.gray100,
  },
  input: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 8,
    fontSize: 14, color: Colors.text,
  },
  buttonRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.gray100, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: Colors.gray600 },
  saveBtn: {
    flex: 1, backgroundColor: Colors.primaryDeep, borderRadius: 14,
    paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },

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
