import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { styles } from './styles';

export default function Card({ title, subtitle, icon, onPress, color = colors.secondary, right }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <MaterialIcons name={icon} size={24} color={colors.text} />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Wrapper>
  );
}