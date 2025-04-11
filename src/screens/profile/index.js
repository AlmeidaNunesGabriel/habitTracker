import React, { useContext } from 'react';
import { View, Text, Switch, Image } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './styles';

export default function Profile() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <Image
        source={{ uri: 'https://placecats.com/300/200'}}
        style={styles.image}
      />
      <Text style={[styles.name, { color: darkMode ? '#fff' : '#000' }]}>Gabriel Nunes</Text>
      <Text style={[styles.age, { color: darkMode ? '#ccc' : '#555' }]}>Idade: 25</Text>

      <View style={styles.switchContainer}>
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>Modo Escuro</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}
