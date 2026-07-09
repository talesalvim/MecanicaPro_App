import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import Header from '../components/Header';
import { colors } from '../theme';

const LANGS = [
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
];

export default function LanguageScreen({ navigation }) {
  const { language, changeLanguage, t } = useContext(LanguageContext);

  return (
    <View style={styles.screen}>
      <Header title={t('language')} navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.heading}>{t('selectLanguage')}</Text>
        {LANGS.map((l) => {
          const active = l.code === language;
          return (
            <TouchableOpacity
              key={l.code}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => changeLanguage(l.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.flag}>{l.flag}</Text>
              <Text style={styles.label}>{l.label}</Text>
              {active ? <MaterialIcons name="check-circle" size={24} color={colors.success} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionActive: { borderColor: colors.secondary },
  flag: { fontSize: 28, marginRight: 14 },
  label: { color: colors.text, fontSize: 17, fontWeight: '600', flex: 1 },
});
