import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import MyButton from '../../components/Button';
import styles from './styles';
import { Picker } from '@react-native-picker/picker';

export default function HabitDetails({ route, navigation }) {
  const availableHabits = [
    { id: '1', name: 'Meditar', status: 'Pendente' },
    { id: '2', name: 'Exercitar', status: 'Completado' },
    { id: '3', name: 'Ler um Livro', status: 'Pendente' },
  ];

  const habitFromParams = route?.params?.habit;
  const initialHabitId = habitFromParams?.id || availableHabits[0].id;

  const [selectedHabitId, setSelectedHabitId] = useState(initialHabitId);
  const [status, setStatus] = useState(
    availableHabits.find(h => h.id === initialHabitId)?.status || 'Pendente'
  );

  useEffect(() => {
    // Sempre que o hábito mudar, atualiza o status
    const selected = availableHabits.find(h => h.id === selectedHabitId);
    if (selected) setStatus(selected.status);
  }, [selectedHabitId]);

  const habit = availableHabits.find(h => h.id === selectedHabitId);

  const toggleStatus = () => {
    const newStatus = status === 'Completado' ? 'Pendente' : 'Completado';
    setStatus(newStatus);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Hábito</Text>

      <Text style={styles.subtitle}>Selecione um hábito:</Text>
      <Picker
        selectedValue={selectedHabitId}
        style={{ height: 50, width: 250 }}
        onValueChange={(itemValue) => {
          setSelectedHabitId(itemValue);
        }}
      >
        {availableHabits.map((habit) => (
          <Picker.Item key={habit.id} label={habit.name} value={habit.id} />
        ))}
      </Picker>

      {habit && (
        <>
          <Text style={styles.subtitle}>Nome: {habit.name}</Text>
          <Text style={styles.subtitle}>Status: {status}</Text>
          <MyButton title="Alterar Status" onPress={toggleStatus} />
        </>
      )}

      <MyButton title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
