
import React from 'react';
import { View, Text } from 'react-native';
import MyButton from '../../components/Button';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <Text style={styles.subtitle}>Você completou 3 de 5 hábitos hoje 🎯</Text>

      <View style={styles.buttonContainer}>
        <MyButton title="Ver Meus Hábitos" onPress={() => navigation.navigate('Meus Hábitos')} />
        <MyButton title="Adicionar Novo Hábito" onPress={() => navigation.navigate('Novo Hábito')} />
        <MyButton title="Estatísticas" onPress={() => navigation.navigate('Estatísticas')} />
      </View>
    </View>
  );
}