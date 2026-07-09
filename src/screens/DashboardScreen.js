import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LanguageContext } from '../contexts/LanguageContext';
import { getOrdersWithDetails, getResource } from '../services/api';
import Header from '../components/Header';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { colors } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [os, cl, ve] = await Promise.all([
        getOrdersWithDetails(),
        getResource('clients'),
        getResource('vehicles'),
      ]);
      setOrders(os);
      setClients(cl);
      setVehicles(ve);
    } catch (err) {
      console.log(t('loadError'), err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const count = (status) => orders.filter((o) => o.status === status).length;
  const recent = [...orders].slice(-3).reverse();

  return (
    <View style={styles.screen}>
      <Header title={t('dashboard')} navigation={navigation} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.secondary} size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.secondary} />}
        >
          <View style={styles.row}>
            <StatBox label={t('totalOpen')} value={count('open')} color={colors.warning} />
            <StatBox label={t('totalInProgress')} value={count('inProgress')} color="#3498DB" />
          </View>
          <View style={styles.row}>
            <StatBox label={t('totalCompleted')} value={count('completed')} color={colors.success} />
            <StatBox label={t('totalClients')} value={clients.length} color={colors.secondary} />
          </View>
          <View style={styles.row}>
            <StatBox label={t('totalVehicles')} value={vehicles.length} color="#9B59B6" />
            <StatBox label={t('serviceOrders')} value={orders.length} color="#1ABC9C" />
          </View>

          <Text style={styles.section}>{t('recentOrders')}</Text>
          {recent.map((o) => (
            <Card
              key={o.id}
              title={`${o.orderNumber} — ${o.vehicleLabel}`}
              subtitle={o.services}
              icon="receipt-long"
              onPress={() => navigation.navigate('ServiceOrderDetail', { order: o })}
              right={<StatusBadge status={o.status} />}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statValue: { color: colors.text, fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.textSoft, fontSize: 13, marginTop: 4 },
  section: { color: colors.text, fontSize: 18, fontWeight: '700', marginVertical: 12 },
});
