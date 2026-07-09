import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { LanguageContext } from '../../contexts/LanguageContext';
import { statusColors } from '../../theme';
import { styles } from './styles';

export default function StatusBadge({ status }) {
  const { t } = useContext(LanguageContext);
  const color = statusColors[status] || '#888';
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{t(status)}</Text>
    </View>
  );
}