import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LanguageContext } from '../contexts/LanguageContext';
import { getResource, signUpUser } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', phone: '' },
  });
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUpUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
    reset();
    navigation.navigate('Login')
      Alert.alert(t('appName'), t('registerSuccess'), [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      console.error("Erro no registro:", err); 
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('register')}</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: t('requiredField') }}
        render={({ field: { value, onChange } }) => (
          <InputField label={t('fullName')} value={value} onChangeText={onChange} errorMessage={errors.name?.message} />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{ required: t('requiredField'), pattern: { value: /^\S+@\S+\.\S+$/, message: t('invalidEmail') } }}
        render={({ field: { value, onChange } }) => (
          <InputField label={t('email')} value={value} onChangeText={onChange} keyboardType="email-address" errorMessage={errors.email?.message} />
        )}
      />
      <Controller
        control={control}
        name="phone"
        rules={{ required: t('requiredField') }}
        render={({ field: { value, onChange } }) => (
          <InputField label={t('phone')} value={value} onChangeText={onChange} keyboardType="phone-pad" errorMessage={errors.phone?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: t('requiredField'), minLength: { value: 6, message: t('minPassword') } }}
        render={({ field: { value, onChange } }) => (
          <InputField label={t('password')} value={value} onChangeText={onChange} secureTextEntry errorMessage={errors.password?.message} />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: t('requiredField'),
          validate: (v) => v === passwordValue || t('passwordMismatch'),
        }}
        render={({ field: { value, onChange } }) => (
          <InputField label={t('confirmPassword')} value={value} onChangeText={onChange} secureTextEntry errorMessage={errors.confirmPassword?.message} />
        )}
      />

      <Button title={t('register')} onPress={handleSubmit(onSubmit)} loading={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>{t('backToLogin')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  heading: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  link: { color: colors.secondary, textAlign: 'center', marginTop: 16, fontSize: 15, fontWeight: '600' },
});