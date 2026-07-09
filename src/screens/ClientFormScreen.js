import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LanguageContext } from '../contexts/LanguageContext';
import { postResource, patchResource, deleteResource } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors } from '../theme';

export default function ClientFormScreen({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.email === 'admin@mecanicapro.com';
  const { client } = route.params || {};
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: client?.name || '',
      document: client?.document || '',
      phone: client?.phone || '',
      email: client?.email || '',
      address: client?.address || '',
      city: client?.city || '',
    },
  });

  const handleDelete = () => {
    Alert.alert(t('appName'), t('confirmDelete'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('confirm'), style: 'destructive', onPress: async () => {
        setLoading(true);
        try {
          await deleteResource('clients', client.id);
          navigation.goBack();
        } catch (err) {
          console.error("Erro ao excluir cliente:", err);
          Alert.alert(t('appName'), t('loadError'));
        } finally {
          setLoading(false);
        }
      }},
    ]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { 
        name: data.name,
        document: data.document,
        phone: data.phone,
        email: data.email,     
        address: data.address, 
        city: data.city,
        status: client?.status || 'available'
      };

      const tableName = 'clients'; 

      if (client?.id) {
        await patchResource(tableName, client.id, payload);
      } else {
        await postResource(tableName, payload);
        reset(); 
      }
      Alert.alert(t('appName'), t('registerSuccess') || 'Salvo com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title={client ? t('clients') : t('newClient')} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <Controller control={control} name="name" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('name')} value={value} onChangeText={onChange} errorMessage={errors.name?.message} />
          )} />
        <Controller control={control} name="document"
          rules={{ required: t('requiredField'), minLength: { value: 11, message: t('invalidCpf') } }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('document')} value={value} onChangeText={onChange} errorMessage={errors.document?.message} />
          )} />
        <Controller control={control} name="phone" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('phone')} value={value} onChangeText={onChange} keyboardType="phone-pad" errorMessage={errors.phone?.message} />
          )} />
        <Controller control={control} name="email"
          rules={{ pattern: { value: /^\S+@\S+\.\S+$/, message: t('invalidEmail') } }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('email')} value={value} onChangeText={onChange} keyboardType="email-address" errorMessage={errors.email?.message} />
          )} />
        <Controller control={control} name="address"
          render={({ field: { value, onChange } }) => (
            <InputField label={t('address')} value={value} onChangeText={onChange} />
          )} />
        <Controller control={control} name="city" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('city')} value={value} onChangeText={onChange} errorMessage={errors.city?.message} />
          )} />

        <Button title={t('save')} onPress={handleSubmit(onSubmit)} loading={loading} />
        {isAdmin && client?.id && (
          <Button title={t('delete')} variant="danger" onPress={handleDelete} loading={loading} />
        )}
        <Button title={t('cancel')} variant="secondary" onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
});