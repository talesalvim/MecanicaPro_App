import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primary: { backgroundColor: colors.secondary },
  secondary: { backgroundColor: colors.surface },
  danger: { backgroundColor: colors.error },
  disabled: { opacity: 0.6 },
  text: { color: colors.text, fontWeight: '700', fontSize: 15 },
});