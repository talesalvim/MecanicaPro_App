import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LanguageContext } from '../contexts/LanguageContext';
import { postResource, patchResource } from '../services/api';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors } from '../theme';

export default function MechanicFormScreen({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { mechanic } = route.params || {};
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: mechanic?.name || '',
      specialty: mechanic?.specialty || '',
      phone: mechanic?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        specialty: data.specialty,
        phone: data.phone,
        availability: 'available',
      };

      if (mechanic?.id) {
        await patchResource('mechanics', mechanic.id, payload);
      } else {
        await postResource('mechanics', payload);
      }
      Alert.alert(t('appName'), t('registerSuccess') || 'Salvo com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error("Erro ao salvar mecânico:", err);
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title={mechanic ? t('mechanics') : t('newMechanic')} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <Controller control={control} name="name" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('name')} value={value} onChangeText={onChange} errorMessage={errors.name?.message} />
          )} />
        <Controller control={control} name="specialty" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('specialty')} value={value} onChangeText={onChange} errorMessage={errors.specialty?.message} />
          )} />
        <Controller control={control} name="phone" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('phone')} value={value} onChangeText={onChange} keyboardType="phone-pad" errorMessage={errors.phone?.message} />
          )} />
        <Button title={t('save')} onPress={handleSubmit(onSubmit)} loading={loading} />
        <Button title={t('cancel')} variant="secondary" onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
});