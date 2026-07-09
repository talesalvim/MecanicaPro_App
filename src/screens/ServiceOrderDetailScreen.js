import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LanguageContext } from '../contexts/LanguageContext';
import { patchResource } from '../services/api';
import Header from '../components/Header';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { colors } from '../theme';

export default function ServiceOrderDetailScreen({ navigation, route }) {
  const { t } = useContext(LanguageContext);
  const { order } = route.params;
  const [status, setStatus] = useState(order.status);
  const [history, setHistory] = useState([{ status: order.status, date: order.entryDate }]);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await patchResource('service_orders', order.id, { status: newStatus });
      setStatus(newStatus);
      setHistory((h) => [...h, { status: newStatus, date: new Date().toISOString().slice(0, 10) }]);
    } catch (err) {
      Alert.alert(t('appName'), t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title={order.orderNumber} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.os}>{order.orderNumber}</Text>
            <StatusBadge status={status} />
          </View>
          <Field label={t('selectVehicle')} value={order.vehicleLabel} />
          <Field label={t('responsibleMechanic')} value={order.mechanicName} />
          <Field label={t('services')} value={order.services} />
          <Field label={t('estimatedValue')} value={`R$ ${order.estimatedValue}`} />
          <Field label={t('entryDate')} value={order.entryDate} />
          {order.notes ? <Field label={t('notes')} value={order.notes} /> : null}
        </View>

        <Text style={styles.section}>{t('statusHistory')}</Text>
        {history.map((h, i) => (
          <View key={i} style={styles.historyRow}>
            <StatusBadge status={h.status} />
            <Text style={styles.historyDate}>{h.date}</Text>
          </View>
        ))}

        <View style={{ marginTop: 16 }}>
          {status === 'open' && (
            <Button title={t('startService')} onPress={() => updateStatus('inProgress')} loading={loading} />
          )}
          {status === 'inProgress' && (
            <Button title={t('finishService')} onPress={() => updateStatus('completed')} loading={loading} />
          )}
          {status !== 'completed' && status !== 'cancelled' && (
            <Button title={t('cancelService')} variant="danger" onPress={() => updateStatus('cancelled')} loading={loading} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  os: { color: colors.text, fontSize: 20, fontWeight: '800' },
  field: { marginBottom: 10 },
  fieldLabel: { color: colors.textSoft, fontSize: 12 },
  fieldValue: { color: colors.text, fontSize: 15, marginTop: 2 },
  section: { color: colors.text, fontSize: 18, fontWeight: '700', marginVertical: 14 },
  historyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  historyDate: { color: colors.textSoft, fontSize: 13 },
});