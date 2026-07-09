import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LanguageContext } from '../contexts/LanguageContext';
import { getResource, postResource, patchResource } from '../services/api';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import FilterPicker from '../components/FilterPicker';
import { colors } from '../theme';

export default function ServiceOrderFormScreen({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { order } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { 
      vehicleId: order?.vehicle_id ? String(order.vehicle_id) : '', 
      mechanicId: order?.mechanic_id ? String(order.mechanic_id) : '', 
      services: order?.services || '', 
      estimatedValue: order?.estimated_value ? String(order.estimated_value) : '', 
      notes: order?.notes || '' 
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const [v, m] = await Promise.all([getResource('vehicles'), getResource('mechanics')]);
        setVehicles(v);
        setMechanics(m);

        if (order?.id) {
          reset({
            vehicleId: order.vehicle_id ? String(order.vehicle_id) : '',
            mechanicId: order.mechanic_id ? String(order.mechanic_id) : '',
            services: order.services || '',
            estimatedValue: order.estimated_value ? String(order.estimated_value) : '',
            notes: order.notes || ''
          });
        }
      } catch (err) { 
        console.log("Erro ao carregar dependências da OS:", err.message); 
      }
    })();
  }, [order, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const orderNumber = order?.order_number || 'OS-' + Math.floor(1000 + Math.random() * 9000);
      const entryDate = order?.entry_date || new Date().toISOString().slice(0, 10);
      const payload = {
        order_number: orderNumber,
        vehicle_id: data.vehicleId,       
        mechanic_id: data.mechanicId,     
        services: data.services,
        estimated_value: parseFloat(data.estimatedValue || 0), 
        notes: data.notes || '',
        status: order?.status || 'open',  
        entry_date: entryDate,
      };

      if (order?.id) {
        await patchResource('service_orders', order.id, payload);
      } else {
        await postResource('service_orders', payload);
      }

      Alert.alert(t('appName'), `${t('saveSuccess') || 'Salvo com sucesso!'} (${orderNumber})`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    } catch (err) {
      console.error("Erro ao salvar Ordem de Serviço:", err);
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };
 
  const vehicleOptions = [
    { value: '', label: t('chooseVehicle') },
    ...vehicles.map((v) => ({ value: String(v.id), label: `${v.model} — ${v.plate}` })),
  ];
  const mechanicOptions = [
    { value: '', label: t('chooseMechanic') },
    ...mechanics.map((m) => ({ value: String(m.id), label: `${m.name} (${m.specialty})` })),
  ];

  const onInvalid = (errors) => {
  console.warn("O formulário barrou o envio pelos seguintes erros de validação:", errors);
  };

  return (
    <View style={styles.screen}>
      <Header title={t('newOrder')} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <Controller control={control} name="vehicleId" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <>
              <FilterPicker label={t('selectVehicle')} options={vehicleOptions} selectedValue={value} onValueChange={onChange} />
              {errors.vehicleId ? <Text style={styles.err}>{errors.vehicleId.message}</Text> : null}
            </>
          )} />
        <Controller control={control} name="mechanicId" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <>
              <FilterPicker label={t('responsibleMechanic')} options={mechanicOptions} selectedValue={value} onValueChange={onChange} />
              {errors.mechanicId ? <Text style={styles.err}>{errors.mechanicId.message}</Text> : null}
            </>
          )} />
        <Controller control={control} name="services" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('services')} value={value} onChangeText={onChange} multiline errorMessage={errors.services?.message} />
          )} />
        <Controller control={control} name="estimatedValue" rules={{ required: t('requiredField') }}
          render={({ field: { value, onChange } }) => (
            <InputField label={t('estimatedValue')} value={value} onChangeText={onChange} keyboardType="numeric" errorMessage={errors.estimatedValue?.message} />
          )} />
        <Controller control={control} name="notes"
          render={({ field: { value, onChange } }) => (
            <InputField label={t('notes')} value={value} onChangeText={onChange} multiline />
          )} />

        <Button 
          title={t('save')} 
          onPress={handleSubmit(onSubmit, onInvalid)} 
          loading={loading} 
        />
        <Button title={t('cancel')} variant="secondary" onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  err: { color: colors.error, fontSize: 12, marginTop: -6, marginBottom: 8 },
});