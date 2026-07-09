import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LanguageContext } from '../contexts/LanguageContext';
import { getResource, postResource, patchResource, deleteResource } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import FilterPicker from '../components/FilterPicker';
import { colors } from '../theme';

const PLATE_REGEX = /^([A-Za-z]{3}-?\d{4}|[A-Za-z]{3}\d[A-Za-z]\d{2})$/;

export default function VehicleFormScreen({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { vehicle } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.email === 'admin@mecanicapro.com';

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      plate: vehicle?.plate || '',
      brand: vehicle?.brand || '',
      model: vehicle?.model || '',
      year: vehicle?.year || '',
      color: vehicle?.color || '',
      type: vehicle?.type || 'car',
      mileage: vehicle?.mileage || '',
      clientId: vehicle?.clientId || '',
    },
  });

  useEffect(() => {
    (async () => {
      try { setClients(await getResource('clients')); }
      catch (err) { console.log(err.message); }
    })();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { 
        brand: data.brand,
        model: data.model,
        plate: data.plate, 
        year: data.year,
        client_id: data.clientId,
        color: data.color,
        type: data.type,
        mileage: data.mileage
      };

      if (vehicle?.id) {
        await patchResource('vehicles', vehicle.id, payload);
      } else {
        await postResource('vehicles', payload);
      }

      // Alerta de sucesso antes de voltar (ajuda a saber que deu certo)
      Alert.alert(t('appName'), t('registerSuccess') || 'Veículo salvo com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (err) {
      console.error("Erro ao salvar veículo:", err);
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t('appName'), t('confirmDelete'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('confirm'), style: 'destructive', onPress: async () => {
        setLoading(true);
        try {
          await deleteResource('vehicles', vehicle.id);
          navigation.goBack();
        } catch (err) {
          console.error("Erro ao deletar veículo:", err);
          Alert.alert(t('appName'), t('loadError'));
        } finally {
          setLoading(false);
        }
      }},
    ]);
  };

  const typeOptions = [
    { value: 'car', label: t('car') },
    { value: 'motorcycle', label: t('motorcycle') },
    { value: 'truck', label: t('truck') },
  ];
  const clientOptions = [
    { value: '', label: '—' },
    ...clients.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <View style={styles.screen}>
      <Header title={vehicle ? t('vehicles') : t('newVehicle')} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <Controller control={control} name="plate"
          rules={{ required: t('requiredField'), pattern: { value: PLATE_REGEX, message: t('invalidPlate') } }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('plate')} value={value} onChangeText={onChange} errorMessage={errors.plate?.message} />
          )} />
        <Controller control={control} name="brand" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('brand')} value={value} onChangeText={onChange} errorMessage={errors.brand?.message} />
          )} />
        <Controller control={control} name="model" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('model')} value={value} onChangeText={onChange} errorMessage={errors.model?.message} />
          )} />
        <Controller control={control} name="year"
          rules={{ required: t('requiredField'), pattern: { value: /^\d{4}$/, message: t('requiredField') } }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('year')} value={value} onChangeText={onChange} keyboardType="numeric" errorMessage={errors.year?.message} />
          )} />
        <Controller control={control} name="color"
          render={({ field: { value, onChange } }) => (
            <InputField label={t('color')} value={value} onChangeText={onChange} />
          )} />
        <Controller control={control} name="mileage"
          render={({ field: { value, onChange } }) => (
            <InputField label={t('mileage')} value={value} onChangeText={onChange} keyboardType="numeric" />
          )} />
        <Controller control={control} name="type"
          render={({ field: { value, onChange } }) => (
            <FilterPicker label={t('type')} options={typeOptions} selectedValue={value} onValueChange={onChange} />
          )} />
        <Controller control={control} name="clientId"
          render={({ field: { value, onChange } }) => (
            <FilterPicker label={t('owner')} options={clientOptions} selectedValue={value} onValueChange={onChange} />
          )} />

        <Button title={t('save')} onPress={handleSubmit(onSubmit)} loading={loading} />
        {isAdmin && vehicle?.id && (
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