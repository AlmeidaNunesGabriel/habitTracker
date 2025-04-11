import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import MyButton from '../../components/Button';
import getStyles from './styles';
import { ThemeContext } from '../../context/ThemeContext';

export default function HabitListScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme); // ✅ agora sim!

  const [habits, setHabits] = useState([
    { id: '1', name: 'Meditar', completed: false },
    { id: '2', name: 'Exercitar', completed: true },
    { id: '3', name: 'Ler um Livro', completed: false },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detalhes dos Hábitos', { habit: item })}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardStatus}>
          {item.completed ? 'Completado' : 'Pendente'}
        </Text>
      </View>
    </TouchableOpacity>
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
      <MyButton title="Adicionar Novo Hábito" onPress={() => navigation.navigate('Novo Hábito')} />
    </View>
  );
}
