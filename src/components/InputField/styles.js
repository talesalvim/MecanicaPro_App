import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { color: colors.text, marginBottom: 6, fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  multiline: { height: 90, textAlignVertical: 'top' },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 12, marginTop: 4 },
});