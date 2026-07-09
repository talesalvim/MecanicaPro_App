import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { color: colors.textSoft, marginBottom: 6, fontSize: 13 },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: { color: colors.text },
});