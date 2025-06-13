import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para carregar hábitos da API
  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getTasks();
      
      // Converter formato da API para formato do app
      const formattedHabits = data.map(task => ({
        id: task.id?.toString() || task._id?.toString(),
        name: task.title || task.name,
        description: task.description || '',
        completed: task.completed || false,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));
      
      setHabits(formattedHabits);
    } catch (err) {
      console.error('Erro ao carregar hábitos:', err);
      setError('Erro ao carregar hábitos. Usando dados locais.');
      
      // Fallback para dados locais se a API falhar
      setHabits([
        { id: '1', name: 'Meditar', completed: false, description: 'Meditação diária' },
        { id: '2', name: 'Exercitar', completed: true, description: 'Exercícios físicos' },
        { id: '3', name: 'Ler um Livro', completed: false, description: 'Leitura diária' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar hábitos ao inicializar
  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async (name, description) => {
    try {
      setLoading(true);
      setError(null);
      
      const newHabitData = {
        title: name,
        description: description || '',
        completed: false
      };

      const createdHabit = await ApiService.createTask(newHabitData);
      
      const formattedHabit = {
        id: createdHabit.id?.toString() || createdHabit._id?.toString() || Date.now().toString(),
        name: createdHabit.title || name,
        description: createdHabit.description || description,
        completed: createdHabit.completed || false,
        createdAt: createdHabit.createdAt,
        updatedAt: createdHabit.updatedAt
      };

      setHabits(prevHabits => [...prevHabits, formattedHabit]);
      return formattedHabit;
    } catch (err) {
      console.error('Erro ao adicionar hábito:', err);
      setError('Erro ao adicionar hábito. Tente novamente.');
      
      // Adicionar localmente se a API falhar
      const localHabit = {
        id: Date.now().toString(),
        name,
        description,
        completed: false,
      };
      setHabits(prevHabits => [...prevHabits, localHabit]);
      return localHabit;
    } finally {
      setLoading(false);
    }
  };

  const updateHabit = async (habitId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        title: updates.name,
        description: updates.description,
        completed: updates.completed
      };

      const updatedHabit = await ApiService.updateTask(habitId, updateData);
      
      const formattedHabit = {
        id: updatedHabit.id?.toString() || updatedHabit._id?.toString() || habitId,
        name: updatedHabit.title || updates.name,
        description: updatedHabit.description || updates.description,
        completed: updatedHabit.completed ?? updates.completed,
        updatedAt: updatedHabit.updatedAt
      };

      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId ? { ...habit, ...formattedHabit } : habit
        )
      );
      return formattedHabit;
    } catch (err) {
      console.error('Erro ao atualizar hábito:', err);
      setError('Erro ao atualizar hábito. Tente novamente.');
      
      // Atualizar localmente se a API falhar
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId ? { ...habit, ...updates } : habit
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      setLoading(true);
      setError(null);

      await ApiService.deleteTask(habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (err) {
      console.error('Erro ao deletar hábito:', err);
      setError('Erro ao deletar hábito. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHabitCompletion = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      await updateHabit(habitId, { 
        name: habit.name,
        description: habit.description,
        completed: !habit.completed 
      });
    }
  };

  const refreshHabits = () => {
    loadHabits();
  };

  return (
    <HabitsContext.Provider 
      value={{ 
        habits, 
        loading, 
        error, 
        addHabit, 
        updateHabit, 
        deleteHabit, 
        toggleHabitCompletion, 
        refreshHabits 
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