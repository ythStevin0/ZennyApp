import React, { ReactNode } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform,
} from 'react-native';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { ActiveTab } from '../types';
import { Colors } from '../utils/colors';

const { width: SCREEN_W } = Dimensions.get('window');

interface LayoutProps {
  children: ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: 'home' | 'smartview' | 'add' | 'goals' | 'reminder') => void;
}

const NAV_H = 80;

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const isHideNav = activeTab === 'add' || activeTab === 'add-reminder' || activeTab === 'add-goal';

  return (
    <View style={styles.container}>
      <View style={styles.main}>{children}</View>

      {!isHideNav && (
        <View style={styles.navWrapper}>
          {/* FAB */}
          <TouchableOpacity style={styles.fab} onPress={() => onTabChange('add')}>
            <Ionicons name="add" size={32} color={Colors.white} strokeWidth={3} />
          </TouchableOpacity>

          {/* SVG Nav Background */}
          <View style={styles.svgWrapper}>
            <Svg width={SCREEN_W} height={NAV_H} viewBox={`0 0 375 ${NAV_H}`} preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#D946EF" />
                  <Stop offset="100%" stopColor="#7C3AED" />
                </LinearGradient>
              </Defs>
              <Path
                d="M0,0 L137.5,0 C137.5,0 147.5,0 152.5,10 C157.5,20 167.5,45 187.5,45 C207.5,45 217.5,20 222.5,10 C227.5,0 237.5,0 237.5,0 L375,0 L375,80 L0,80 Z"
                fill="url(#navGrad)"
              />
            </Svg>
          </View>

          {/* Nav Items */}
          <View style={styles.navItems}>
            <View style={styles.navLeft}>
              <NavItem
                icon="home"
                label="Home"
                active={activeTab === 'home'}
                onPress={() => onTabChange('home')}
              />
              <NavItem
                icon="grid"
                label="SmartView"
                active={activeTab === 'smartview'}
                onPress={() => onTabChange('smartview')}
              />
            </View>

            {/* Center spacer for FAB */}
            <View style={{ width: 96 }} />

            <View style={styles.navRight}>
              <NavItem
                icon="trophy"
                label="Goals"
                active={activeTab === 'goals'}
                onPress={() => onTabChange('goals')}
              />
              <NavItem
                icon="notifications"
                label="Reminder"
                active={activeTab === 'reminder'}
                onPress={() => onTabChange('reminder')}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function NavItem({
  icon, label, active, onPress,
}: {
  icon: string; label: string; active: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
        <Ionicons
          name={active ? (icon as any) : (`${icon}-outline` as any)}
          size={24}
          color={active ? Colors.primaryDeep : 'rgba(255,255,255,0.7)'}
        />
      </View>
      <Text style={[styles.navLabel, active ? styles.navLabelActive : styles.navLabelInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  main: { flex: 1 },

  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_H + 32, // extra for FAB
  },

  svgWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_H,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },

  fab: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 64, height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 5, borderColor: Colors.gray50,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 12,
  },

  navItems: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
  },
  navLeft: { flex: 1, flexDirection: 'row' },
  navRight: { flex: 1, flexDirection: 'row' },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navIconWrap: {
    padding: 8,
    borderRadius: 20,
    marginBottom: 2,
  },
  navIconWrapActive: {
    backgroundColor: Colors.white,
    transform: [{ translateY: -8 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  navLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  navLabelActive: { color: Colors.white },
  navLabelInactive: { color: 'rgba(255,255,255,0.65)' },
});
