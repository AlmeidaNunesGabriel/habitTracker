import React, { useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './styles';

const Loading = ({ message = 'Carregando...', size = 'large' }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size={size} color="#6200ee" />
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </View>
  );
};

export default Loading;