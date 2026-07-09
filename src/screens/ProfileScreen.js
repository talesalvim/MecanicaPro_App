import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  return (
    <View style={styles.screen}>
      <Header title={t('profile')} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.avatar}>
          <MaterialIcons name="account-circle" size={96} color={colors.secondary} />
        </View>
        <View style={styles.card}>
          <Field label={t('name')} value={user?.name || '—'} />
          <Field label={t('email')} value={user?.email || '—'} />
          <Field label={t('phone')} value={user?.phone || '—'} />
        </View>
        <Button title={t('logout')} variant="danger" onPress={logout} />
      </View>
    </View>
  );
}

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  avatar: { alignItems: 'center', marginBottom: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 18, marginBottom: 24 },
  field: { marginBottom: 14 },
  label: { color: colors.textSoft, fontSize: 12 },
  value: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 2 },
});
