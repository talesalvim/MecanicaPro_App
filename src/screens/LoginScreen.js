import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { getResource } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors } from '../theme';
import CryptoJS from 'crypto-js';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const encryptedPassword = CryptoJS.MD5(password).toString();

      const users = await getResource('users');
      
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === encryptedPassword
      );

      if (found) {
        login(found);
      } else {
        Alert.alert(t('appName'), t('invalidCredentials'));
      }
    } catch (err) {
      console.error("Erro no login:", err);
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoBox}>
        <MaterialIcons name="build-circle" size={64} color={colors.secondary} />
        <Text style={styles.appName}>{t('appName')}</Text>
      </View>

      <Controller
        control={control}
        name="email"
        rules={{
          required: t('requiredField'),
          pattern: { value: /^\S+@\S+\.\S+$/, message: t('invalidEmail') },
        }}
        render={({ field: { value, onChange } }) => (
          <InputField
            label={t('email')}
            placeholder="email@email.com"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            errorMessage={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: t('requiredField'),
          minLength: { value: 6, message: t('minPassword') },
        }}
        render={({ field: { value, onChange } }) => (
          <InputField
            label={t('password')}
            placeholder="******"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            errorMessage={errors.password?.message}
          />
        )}
      />

      <Button title={t('login')} onPress={handleSubmit(onSubmit)} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>{t('createAccount')}</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Demo: admin@mecanicapro.com / 123456</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  logoBox: { alignItems: 'center', marginBottom: 32 },
  appName: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 },
  link: { color: colors.secondary, textAlign: 'center', marginTop: 16, fontSize: 15, fontWeight: '600' },
  hint: { color: colors.textSoft, textAlign: 'center', marginTop: 24, fontSize: 12 },
});