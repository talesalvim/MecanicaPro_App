import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity, Modal, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import { getResource, postResource } from '../services/api';
import Header from '../components/Header';
import Card from '../components/Card';
import FilterPicker from '../components/FilterPicker';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors } from '../theme';

export default function MechanicListScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specFilter, setSpecFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', specialty: '', phone: '' },
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResource('mechanics');
      setMechanics(data);
    } catch (err) {
      console.log(t('loadError'), err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const specialties = ['all', ...Array.from(new Set(mechanics.map((m) => m.specialty)))];
  const options = specialties.map((s) => ({ value: s, label: s === 'all' ? t('all') : s }));
  const filtered = specFilter === 'all' ? mechanics : mechanics.filter((m) => m.specialty === specFilter);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await postResource('mechanics', { ...data, availability: 'available' });
      reset();
      setModalVisible(false);
      loadData();
    } catch (err) {
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title={t('mechanics')} navigation={navigation} />
      <View style={styles.container}>
        <FilterPicker label={`${t('filter')} ${t('specialty')}`} options={options} selectedValue={specFilter} onValueChange={setSpecFilter} />
        {loading ? (
          <ActivityIndicator color={colors.secondary} size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>{t('noData')}</Text>}
            renderItem={({ item }) => (
              <Card
                title={item.name}
                subtitle={`${item.specialty} • ${item.phone} • ${t(item.availability)}`}
                icon="engineering"
                color={item.availability === 'available' ? colors.success : colors.warning}
              />
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={28} color={colors.text} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t('newMechanic')}</Text>
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
            <Button title={t('save')} onPress={handleSubmit(onSubmit)} loading={saving} />
            <Button title={t('cancel')} variant="secondary" onPress={() => { reset(); setModalVisible(false); }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16 },
  empty: { color: colors.textSoft, textAlign: 'center', marginTop: 30 },
  fab: {
    position: 'absolute', right: 20, bottom: 24,
    backgroundColor: colors.secondary, width: 56, height: 56,
    borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5,
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: colors.background, borderRadius: 16, padding: 20 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: 16 },
});