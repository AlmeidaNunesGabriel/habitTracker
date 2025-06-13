import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, ActivityIndicator, ScrollView } from 'react-native';
import MyButton from '../../components/Button';
import styles from './styles';
import { Picker } from '@react-native-picker/picker';
import { useHabits } from '../../context/HabitsContext';
import { ThemeContext } from '../../context/ThemeContext';

export default function HabitDetails({ route, navigation }) {
  const { habits, updateHabit, loading } = useHabits();
  const { theme } = useContext(ThemeContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const habitFromParams = route?.params?.habit;
  const initialHabitId = habitFromParams?.id || (habits.length > 0 ? habits[0].id : null);

  const [selectedHabitId, setSelectedHabitId] = useState(initialHabitId);
  const [selectedHabit, setSelectedHabit] = useState(null);

  useEffect(() => {
    if (selectedHabitId) {
      const habit = habits.find(h => h.id === selectedHabitId);
      setSelectedHabit(habit);
    }
  }, [selectedHabitId, habits]);

  const toggleStatus = async () => {
    if (!selectedHabit) return;

    setIsUpdating(true);
    try {
      await updateHabit(selectedHabit.id, {
        name: selectedHabit.name,
        description: selectedHabit.description,
        completed: !selectedHabit.completed
      });
      
      Alert.alert(
        'Sucesso',
        `Hábito "${selectedHabit.name}" ${!selectedHabit.completed ? 'completado' : 'marcado como pendente'}!`
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status do hábito');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading && habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Carregando hábitos...
        </Text>
      </View>
    );
  }

  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Nenhum hábito encontrado
        </Text>
        <Text style={[styles.subtitle, { color: theme.subtleText }]}>
          Adicione alguns hábitos primeiro para visualizar os detalhes.
        </Text>
        <MyButton 
          title="Adicionar Hábito" 
          onPress={() => navigation.navigate('Novo Hábito')} 
        />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Detalhes do Hábito</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Selecione um hábito:
        </Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.card }]}>
          <Picker
            selectedValue={selectedHabitId}
            style={[styles.picker, { color: theme.text }]}
            onValueChange={(itemValue) => setSelectedHabitId(itemValue)}
          >
            {habits.map((habit) => (
              <Picker.Item 
                key={habit.id} 
                label={habit.name} 
                value={habit.id}
                color={theme.text}
              />
            ))}
          </Picker>
        </View>
      </View>

      {selectedHabit && (
        <View style={styles.detailsContainer}>
          <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.detailLabel, { color: theme.subtleText }]}>Nome:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {selectedHabit.name}
            </Text>
          </View>

          {selectedHabit.description && (
            <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.detailLabel, { color: theme.subtleText }]}>Descrição:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {selectedHabit.description}
              </Text>
            </View>
          )}

          <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.detailLabel, { color: theme.subtleText }]}>Status:</Text>
            <Text style={[
              styles.detailValue, 
              styles.statusText,
              { color: selectedHabit.completed ? '#4CAF50' : '#FF9800' }
            ]}>
              {selectedHabit.completed ? '✅ Completado' : '⏳ Pendente'}
            </Text>
          </View>

          {selectedHabit.createdAt && (
            <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.detailLabel, { color: theme.subtleText }]}>Criado em:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {formatDate(selectedHabit.createdAt)}
              </Text>
            </View>
          )}

          {selectedHabit.updatedAt && (
            <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.detailLabel, { color: theme.subtleText }]}>Última atualização:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {formatDate(selectedHabit.updatedAt)}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <MyButton 
              title={isUpdating ? "Atualizando..." : "Alterar Status"}
              onPress={toggleStatus}
              color={isUpdating ? "#999" : "#6200ee"}
              disabled={isUpdating}
            />
            
            {isUpdating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#6200ee" />
                <Text style={[styles.loadingText, { color: theme.subtleText }]}>
                  Atualizando status...
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.bottomButtons}>
        <MyButton 
          title="Voltar" 
          onPress={() => navigation.goBack()}
          color="#666"
        />
      </View>
    </ScrollView>
  );
}