import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Hero Section ── */}
      <View style={styles.hero}>
        <SafeAreaView>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon} />
              <Text style={styles.brandText}>NovaCare</Text>
            </View>
            <View style={styles.topActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>👤</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, styles.iconBtnActive]}>
                <Text style={styles.iconBtnText}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting */}
          <Text style={styles.greeting}>Hope You're{'\n'}Feeling Well Today!</Text>

          {/* Doctor Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorAvatar} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. William{'\n'}Jhonon</Text>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>Dentist</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Dashboard Section ── */}
      <ScrollView
        style={styles.dashboard}
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>

        <View style={styles.cardsRow}>
          {/* Consultations Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#E8F4FF' }]}>
                <Text style={styles.cardIconText}>➕</Text>
              </View>
              <Text style={styles.cardTitle}>Consultations</Text>
            </View>
            <View style={styles.cardStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>55</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Upcoming</Text>
                <Text style={styles.statValue}>32</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewMoreBtn}>
              <Text style={styles.viewMoreText}>View More  »</Text>
            </TouchableOpacity>
          </View>

          {/* Chat Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#E8F4FF' }]}>
                <Text style={styles.cardIconText}>💬</Text>
              </View>
              <Text style={styles.cardTitle}>Chat</Text>
            </View>
            <View style={styles.cardStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>445</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>New</Text>
                <Text style={styles.statValue}>12</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewMoreBtn}>
              <Text style={styles.viewMoreText}>View More  »</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer so content isn't hidden behind nav bar */}
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // ── Hero ──
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  brandText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: colors.secondary,
  },
  iconBtnText: {
    fontSize: 16,
  },
  greeting: {
    color: colors.textLight,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  specialtyBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  specialtyText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Dashboard ──
  dashboard: {
    flex: 1,
  },
  dashboardContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    flex: 1,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
  },
  viewMoreBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HomeScreen;
