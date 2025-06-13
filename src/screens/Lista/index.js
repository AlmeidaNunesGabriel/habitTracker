import React, { useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import getStyles from './styles';
import MyButton from '../../components/Button';
import { useHabits } from '../../context/HabitsContext';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';

export default function HabitListScreen({ navigation }) {
  const { 
    habits, 
    loading, 
    error, 
    toggleHabitCompletion, 
    deleteHabit, 
    refreshHabits 
  } = useHabits();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
    }, [])
  );

  const handleToggleCompletion = async (habitId) => {
    try {
      await toggleHabitCompletion(habitId);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o hábito');
    }
  };

  const handleDeleteHabit = (habitId, habitName) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o hábito "${habitName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habitId);
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir o hábito');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Detalhes', { habit: item })}
        style={styles.cardContent}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.description && (
          <Text style={styles.cardDescription}>{item.description}</Text>
        )}
        <Text style={[
          styles.cardStatus,
          { color: item.completed ? '#4CAF50' : '#FF9800' }
        ]}>
          {item.completed ? '✅ Completado' : '⏳ Pendente'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => handleToggleCompletion(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.completed ? 'Desfazer' : 'Completar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteHabit(item.id, item.name)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && habits.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Carregando hábitos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Hábitos</Text>
        {loading && (
          <ActivityIndicator size="small" color="#6200ee" />
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshHabits}
            colors={['#6200ee']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum hábito encontrado.{'\n'}
              Adicione seu primeiro hábito!
            </Text>
          </View>
        }
      />
      
      <MyButton 
        title="Adicionar Novo Hábito" 
        onPress={() => navigation.navigate('Adicionar')} 
      />
    </View>
  );
}