import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'android' ? 56 + StatusBar.currentHeight : 56 + 40,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
});