// pages/HabitListScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList} from 'react-native';
import MyButton from '../../components/Button';
import styles from './styles';


export default function HabitListScreen({ navigation }) {

  const [habits, setHabits] = useState([
    { id: '1', name: 'Meditar', completed: false },
    { id: '2', name: 'Exercitar', completed: true },
    { id: '3', name: 'Ler um Livro', completed: false },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardStatus}>
        {item.completed ? 'Completado' : 'Pendente'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Hábitos</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Botão para navegar para a tela de adicionar novo hábito */}
      <MyButton
        title="Adicionar Novo Hábito"
        onPress={() => navigation.navigate('Novo Hábito')}
      />
    </View>
  );
}