import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AuthContext } from '../contexts/AuthContext';
import DrawerContent from './DrawerContent';
import { colors } from '../theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LanguageScreen from '../screens/LanguageScreen';
import ClientListScreen from '../screens/ClientListScreen';
import ClientFormScreen from '../screens/ClientFormScreen';
import VehicleListScreen from '../screens/VehicleListScreen';
import VehicleFormScreen from '../screens/VehicleFormScreen';
import ServiceOrderListScreen from '../screens/ServiceOrderListScreen';
import ServiceOrderFormScreen from '../screens/ServiceOrderFormScreen';
import ServiceOrderDetailScreen from '../screens/ServiceOrderDetailScreen';
import MechanicListScreen from '../screens/MechanicListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.primary, width: 280 },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Clients" component={ClientListScreen} />
      <Drawer.Screen name="Vehicles" component={VehicleListScreen} />
      <Drawer.Screen name="ServiceOrders" component={ServiceOrderListScreen} />
      <Drawer.Screen name="Mechanics" component={MechanicListScreen} />
      <Drawer.Screen name="Language" component={LanguageScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen name="ClientForm" component={ClientFormScreen} />
            <Stack.Screen name="VehicleForm" component={VehicleFormScreen} />
            <Stack.Screen name="ServiceOrderForm" component={ServiceOrderFormScreen} />
            <Stack.Screen name="ServiceOrderDetail" component={ServiceOrderDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}