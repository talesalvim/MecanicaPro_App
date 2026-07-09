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

export default function ClientListScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResource('clients');
      setClients(data);
    } catch (err) {
      console.log(t('loadError'), err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const cities = ['all', ...Array.from(new Set(clients.map((c) => c.city)))];
  const options = cities.map((c) => ({ value: c, label: c === 'all' ? t('all') : c }));
  const filtered = cityFilter === 'all' ? clients : clients.filter((c) => c.city === cityFilter);

  return (
    <View style={styles.screen}>
      <Header title={t('clients')} navigation={navigation} />
      <View style={styles.container}>
        <FilterPicker label={`${t('filter')} ${t('city')}`} options={options} selectedValue={cityFilter} onValueChange={setCityFilter} />
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
                subtitle={`${item.phone} • ${item.city}`}
                icon="person"
                onPress={() => navigation.navigate('ClientForm', { client: item })}
              />
            )}
          />
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ClientForm', {})}>
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