import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import { getResource } from '../services/api';
import Header from '../components/Header';
import Card from '../components/Card';
import FilterPicker from '../components/FilterPicker';
import { colors } from '../theme';

const ICONS = { car: 'directions-car', motorcycle: 'two-wheeler', truck: 'local-shipping' };

export default function VehicleListScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResource('vehicles');
      setVehicles(data);
    } catch (err) {
      console.log(t('loadError'), err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const options = [
    { value: 'all', label: t('all') },
    { value: 'car', label: t('car') },
    { value: 'motorcycle', label: t('motorcycle') },
    { value: 'truck', label: t('truck') },
  ];
  const filtered = typeFilter === 'all' ? vehicles : vehicles.filter((v) => v.type === typeFilter);

  return (
    <View style={styles.screen}>
      <Header title={t('vehicles')} navigation={navigation} />
      <View style={styles.container}>
        <FilterPicker label={`${t('filter')} ${t('type')}`} options={options} selectedValue={typeFilter} onValueChange={setTypeFilter} />
        {loading ? (
          <ActivityIndicator color={colors.secondary} size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>{t('noData')}</Text>}
            renderItem={({ item }) => (
              <Card
                title={`${item.model} — ${item.plate}`}
                subtitle={`${item.year} • ${item.ownerName} • ${t(item.type)}`}
                icon={ICONS[item.type] || 'directions-car'}
                onPress={() => navigation.navigate('VehicleForm', { vehicle: item })}
              />
            )}
          />
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('VehicleForm', {})}>
        <MaterialIcons name="add" size={28} color={colors.text} />
      </TouchableOpacity>
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
});