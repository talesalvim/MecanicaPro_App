import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../theme';
import { styles } from './styles';

// Componente controlado: o pai passa selectedValue e recebe onValueChange (filtra a FlatList)
export default function FilterPicker({ options, selectedValue, onValueChange, label }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          dropdownIconColor={colors.text}
          style={styles.picker}
        >
          {options.map((opt) => (
            <Picker.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
              color={colors.primary}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}