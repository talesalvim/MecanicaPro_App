import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { colors } from '../theme';

const MENU = [
  { route: 'Dashboard', icon: 'dashboard', key: 'dashboard' },
  { route: 'Clients', icon: 'people', key: 'clients' },
  { route: 'Vehicles', icon: 'directions-car', key: 'vehicles' },
  { route: 'ServiceOrders', icon: 'receipt-long', key: 'serviceOrders' },
  { route: 'Mechanics', icon: 'engineering', key: 'mechanics' },
  { route: 'Language', icon: 'language', key: 'language' },
  { route: 'Profile', icon: 'person', key: 'profile' },
];

export default function DrawerContent(props) {
  const { user, logout } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.header}>
          <MaterialIcons name="build-circle" size={40} color={colors.secondary} />
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menu}>
          {MENU.map((item) => {
            const active = currentRoute === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.item, active && styles.itemActive]}
                onPress={() => props.navigation.navigate(item.route)}
              >
                <MaterialIcons name={item.icon} size={22} color={active ? colors.secondary : colors.text} />
                <Text style={[styles.itemText, active && styles.itemTextActive]}>{t(item.key)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <MaterialIcons name="logout" size={22} color={colors.error} />
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.surface, marginBottom: 8 },
  appName: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 6 },
  userName: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 12 },
  userEmail: { color: colors.textSoft, fontSize: 13, marginTop: 2 },
  menu: { paddingHorizontal: 10 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10 },
  itemActive: { backgroundColor: colors.surface },
  itemText: { color: colors.text, fontSize: 15, marginLeft: 16, fontWeight: '500' },
  itemTextActive: { color: colors.secondary, fontWeight: '700' },
  logout: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderTopWidth: 1, borderTopColor: colors.surface,
  },
  logoutText: { color: colors.error, fontSize: 15, marginLeft: 16, fontWeight: '700' },
});