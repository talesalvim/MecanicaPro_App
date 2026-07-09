import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../../theme';
import { styles } from './styles';

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  errorMessage,
  keyboardType = 'default',
  multiline = false,
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, errorMessage && styles.inputError, multiline && styles.multiline]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize="none"
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}