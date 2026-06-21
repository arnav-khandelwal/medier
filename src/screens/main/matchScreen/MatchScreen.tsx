import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../../theme/colors';
import { useTranslation } from '../../../utils/translations/LanguageContext';

const MatchScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.title}>{t('match')}</Text>
        <Text style={styles.subtitle}>{t('findYourPerfectDoctorMatch')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emoji: { fontSize: 52 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textDark },
  subtitle: { fontSize: 14, color: colors.textMuted },
});

export default MatchScreen;
