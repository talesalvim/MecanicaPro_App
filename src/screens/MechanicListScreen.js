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

export default function MechanicListScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specFilter, setSpecFilter] = useState('all');

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
                onPress={() => navigation.navigate('MechanicForm', { mechanic: item })}
              />
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('MechanicForm', {})}>
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