import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    habitsThisWeek: 0,
    streak: 0,
  });

  // Função para carregar hábitos da API
  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Testa a conexão primeiro
      const isConnected = await ApiService.testConnection();
      if (!isConnected) {
        setError('Sem conexão com a internet. Usando dados locais.');
      }
      
      const data = await ApiService.getTasks();
      
      // Converter formato da API para formato do app
      const formattedHabits = data.map(task => ({
        id: task.id?.toString() || task._id?.toString(),
        name: task.title || task.name,
        description: task.description || '',
        completed: task.completed || false,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        source: task.source || 'unknown'
      }));
      
      setHabits(formattedHabits);
      
      // Carrega estatísticas
      const stats = await ApiService.getStatistics();
      setStatistics(stats);
      
      console.log(`Carregados ${formattedHabits.length} hábitos`);
      
    } catch (err) {
      console.error('Erro ao carregar hábitos:', err);
      setError('Erro ao carregar hábitos. Verifique sua conexão.');
      
      // Fallback para dados locais básicos
      const fallbackHabits = [
        { 
          id: 'fallback_1', 
          name: 'Meditar', 
          completed: false, 
          description: 'Meditação diária',
          createdAt: new Date().toISOString()
        },
        { 
          id: 'fallback_2', 
          name: 'Exercitar', 
          completed: true, 
          description: 'Exercícios físicos',
          createdAt: new Date().toISOString()
        },
        { 
          id: 'fallback_3', 
          name: 'Ler', 
          completed: false, 
          description: 'Leitura diária',
          createdAt: new Date().toISOString()
        },
      ];
      
      setHabits(fallbackHabits);
    } finally {
      setLoading(false);
    }
  };

  // Carregar hábitos ao inicializar
  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async (name, description) => {
    if (!name || !name.trim()) {
      throw new Error('Nome do hábito é obrigatório');
    }

    try {
      setLoading(true);
      setError(null);
      
      const newHabitData = {
        title: name.trim(),
        description: description?.trim() || '',
        completed: false
      };

      console.log('Criando hábito:', newHabitData);
      const createdHabit = await ApiService.createTask(newHabitData);
      
      const formattedHabit = {
        id: createdHabit.id?.toString() || Date.now().toString(),
        name: createdHabit.title || name,
        description: createdHabit.description || description,
        completed: createdHabit.completed || false,
        createdAt: createdHabit.createdAt || new Date().toISOString(),
        updatedAt: createdHabit.updatedAt || new Date().toISOString(),
        source: createdHabit.source || 'local'
      };

      setHabits(prevHabits => [...prevHabits, formattedHabit]);
      
      // Atualiza estatísticas
      await updateStatistics();
      
      console.log('Hábito adicionado com sucesso:', formattedHabit);
      return formattedHabit;
      
    } catch (err) {
      console.error('Erro ao adicionar hábito:', err);
      setError('Erro ao adicionar hábito. Tente novamente.');
      
      // Adicionar localmente se a API falhar completamente
      const localHabit = {
        id: `emergency_${Date.now()}`,
        name: name.trim(),
        description: description?.trim() || '',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'emergency'
      };
      
      setHabits(prevHabits => [...prevHabits, localHabit]);
      return localHabit;
    } finally {
      setLoading(false);
    }
  };

  const updateHabit = async (habitId, updates) => {
    if (!habitId) {
      throw new Error('ID do hábito é obrigatório');
    }

    try {
      setLoading(true);
      setError(null);

      const updateData = {
        title: updates.name,
        description: updates.description,
        completed: updates.completed
      };

      console.log('Atualizando hábito:', habitId, updateData);
      const updatedHabit = await ApiService.updateTask(habitId, updateData);
      
      const formattedHabit = {
        id: updatedHabit.id?.toString() || habitId,
        name: updatedHabit.title || updates.name,
        description: updatedHabit.description || updates.description,
        completed: updatedHabit.completed ?? updates.completed,
        updatedAt: updatedHabit.updatedAt || new Date().toISOString()
      };

      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId ? { ...habit, ...formattedHabit } : habit
        )
      );
      
      // Atualiza estatísticas
      await updateStatistics();
      
      console.log('Hábito atualizado com sucesso:', formattedHabit);
      return formattedHabit;
      
    } catch (err) {
      console.error('Erro ao atualizar hábito:', err);
      setError('Erro ao atualizar hábito. Tente novamente.');
      
      // Atualizar localmente se a API falhar
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId ? { 
            ...habit, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          } : habit
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!habitId) {
      throw new Error('ID do hábito é obrigatório');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Deletando hábito:', habitId);
      await ApiService.deleteTask(habitId);
      
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
      
      // Atualiza estatísticas
      await updateStatistics();
      
      console.log('Hábito deletado com sucesso:', habitId);
      
    } catch (err) {
      console.error('Erro ao deletar hábito:', err);
      setError('Erro ao deletar hábito. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHabitCompletion = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      throw new Error('Hábito não encontrado');
    }

    console.log('Alternando status do hábito:', habitId, 'de', habit.completed, 'para', !habit.completed);

    await updateHabit(habitId, { 
      name: habit.name,
      description: habit.description,
      completed: !habit.completed 
    });
  };

  const updateStatistics = async () => {
    try {
      const stats = await ApiService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error);
    }
  };

  const refreshHabits = async () => {
    console.log('Atualizando lista de hábitos...');
    await loadHabits();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <HabitsContext.Provider 
      value={{ 
        habits, 
        loading, 
        error, 
        statistics,
        addHabit, 
        updateHabit, 
        deleteHabit, 
        toggleHabitCompletion, 
        refreshHabits,
        updateStatistics,
        clearError
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits deve ser usado dentro de HabitsProvider');
  }
  return context;
};