import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../theme';
import { styles } from './styles';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false }) {
  const variantStyle = {
    primary: styles.primary,
    secondary: styles.secondary,
    danger: styles.danger,
  }[variant];

  return (
    <TouchableOpacity
      style={[styles.button, variantStyle, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}