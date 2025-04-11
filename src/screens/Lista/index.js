import React, {useCallback} from 'react';
import { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import getStyles from './styles';
import MyButton from '../../components/Button';
import { useHabits} from '../../context/HabitsContext';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';


export default function HabitListScreen({ navigation }) {
    const { habits } = useHabits();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    useFocusEffect(
      useCallback(() => {
        // Só serve para garantir re-render.
        // Não precisa fazer nada aqui, só força a atualização
      }, [habits])
    );

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
