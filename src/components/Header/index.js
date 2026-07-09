import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { styles } from './styles';

export default function Header({ title, navigation, showMenu = true }) {
  return (
    <View style={styles.header}>
      {showMenu && navigation ? (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} />
      )}

      <Text style={styles.title}>{title}</Text>

      {/* X de fechar aparece quando não é tela de menu */}
      {!showMenu && navigation ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} />
      )}
    </View>
  );
}