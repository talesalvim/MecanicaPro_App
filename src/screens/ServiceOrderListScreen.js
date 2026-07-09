import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../contexts/LanguageContext';
import { getOrdersWithDetails } from '../services/api';
import Header from '../components/Header';
import Card from '../components/Card';
import FilterPicker from '../components/FilterPicker';
import StatusBadge from '../components/StatusBadge';
import { colors } from '../theme';

export default function ServiceOrderListScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrdersWithDetails();
      setOrders(data);
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
    { value: 'open', label: t('open') },
    { value: 'inProgress', label: t('inProgress') },
    { value: 'completed', label: t('completed') },
  ];
  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <View style={styles.screen}>
      <Header title={t('serviceOrders')} navigation={navigation} />
      <View style={styles.container}>
        <FilterPicker label={`${t('filter')} status`} options={options} selectedValue={statusFilter} onValueChange={setStatusFilter} />
        {loading ? (
          <ActivityIndicator color={colors.secondary} size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>{t('noData')}</Text>}
            renderItem={({ item }) => (
              <Card
                title={`${item.orderNumber} — ${item.vehicleLabel}`}
                subtitle={`${item.entryDate} • ${item.services}`}
                icon="receipt-long"
                onPress={() => navigation.navigate('ServiceOrderDetail', { order: item })}
                right={<StatusBadge status={item.status} />}
              />
            )}
          />
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ServiceOrderForm', {})}>
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