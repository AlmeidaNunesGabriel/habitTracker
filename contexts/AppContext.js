import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { getWeekDates } from '../utils/dateUtils';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  // Carregar dados ao iniciar o app
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Verificar se há um usuário logado
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
          
          // Carregar hábitos do usuário
          await loadHabits(parsedUser.id);
        }
        
        // Configurar datas da semana atual
        const dates = getWeekDates(new Date());
        setWeekDates(dates);
      } catch (error) {
        console.error('Erro ao inicializar:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Função para carregar hábitos do usuário
  const loadHabits = async (userId) => {
    try {
      const habitsData = await AsyncStorage.getItem(`habits_${userId}`);
      if (habitsData) {
        setHabits(JSON.parse(habitsData));
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
      setHabits([]);
    }
  };

  // Função para salvar hábitos do usuário
  const saveHabits = async (updatedHabits) => {
    if (!user) return;
    
    try {
      await AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Erro ao salvar hábitos:', error);
    }
  };

  // Funções de autenticação
  const login = async (email, password) => {
    try {
      // Buscar usuários registrados
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Verificar se as credenciais correspondem
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Salvar usuário na sessão
        await AsyncStorage.setItem('user', JSON.stringify(foundUser));
        setUser(foundUser);
        setIsLoggedIn(true);
        
        // Carregar hábitos do usuário
        await loadHabits(foundUser.id);
        return { success: true };
      } else {
        return { success: false, message: 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, message: 'Erro ao realizar login' };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Buscar usuários registrados
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Verificar se o email já está em uso
      if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email já está em uso' };
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      // Adicionar à lista de usuários
      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Fazer login automático
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsLoggedIn(true);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { success: false, message: 'Erro ao registrar usuário' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
      setHabits([]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Funções de gerenciamento de hábitos
  const addHabit = async (habitData) => {
    if (!user) return { success: false, message: 'Usuário não autenticado' };
    
    try {
      const newHabit = {
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        completedDates: {},
        ...habitData
      };
      
      const updatedHabits = [...habits, newHabit];
      await saveHabits(updatedHabits);
      
      return { success: true, habit: newHabit };
    } catch (error) {
      console.error('Erro ao adicionar hábito:', error);
      return { success: false, message: 'Erro ao adicionar hábito' };
    }
  };

  const updateHabit = async (habitId, updates) => {
    if (!user) return { success: false, message: 'Usuário não autenticado' };
    
    try {
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return { success: false, message: 'Hábito não encontrado' };
      }
      
      const updatedHabits = [...habits];
      updatedHabits[habitIndex] = {
        ...updatedHabits[habitIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await saveHabits(updatedHabits);
      
      return { success: true, habit: updatedHabits[habitIndex] };
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      return { success: false, message: 'Erro ao atualizar hábito' };
    }
  };

  const deleteHabit = async (habitId) => {
    if (!user) return { success: false, message: 'Usuário não autenticado' };
    
    try {
      const updatedHabits = habits.filter(h => h.id !== habitId);
      await saveHabits(updatedHabits);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
      return { success: false, message: 'Erro ao excluir hábito' };
    }
  };

  // Função para marcar um hábito como completo/incompleto em uma data específica
  const toggleHabitCompletion = async (habitId, date) => {
    if (!user) return { success: false, message: 'Usuário não autenticado' };
    
    try {
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return { success: false, message: 'Hábito não encontrado' };
      }
      
      const updatedHabits = [...habits];
      const habit = updatedHabits[habitIndex];
      
      // Inicializar objeto de datas completas se não existir
      if (!habit.completedDates) {
        habit.completedDates = {};
      }
      
      // Toggle completion status
      habit.completedDates[date] = !habit.completedDates[date];
      
      // Atualizar último registro de alteração
      habit.updatedAt = new Date().toISOString();
      
      await saveHabits(updatedHabits);
      
      return { success: true, habit: updatedHabits[habitIndex] };
    } catch (error) {
      console.error('Erro ao marcar hábito:', error);
      return { success: false, message: 'Erro ao marcar hábito' };
    }
  };

  // Função para definir metas para um hábito
  const setHabitGoal = async (habitId, goal) => {
    if (!user) return { success: false, message: 'Usuário não autenticado' };
    
    try {
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex === -1) {
        return { success: false, message: 'Hábito não encontrado' };
      }
      
      const updatedHabits = [...habits];
      const habit = updatedHabits[habitIndex];
      
      // Atualizar meta
      habit.goal = goal;
      habit.updatedAt = new Date().toISOString();
      
      await saveHabits(updatedHabits);
      
      return { success: true, habit: updatedHabits[habitIndex] };
    } catch (error) {
      console.error('Erro ao definir meta:', error);
      return { success: false, message: 'Erro ao definir meta' };
    }
  };

  // Função para mudar de semana
  const changeWeek = (direction) => {
    const currentDateObj = new Date(currentDate);
    const newDate = new Date(currentDateObj);
    
    // Avançar ou retroceder 7 dias
    newDate.setDate(currentDateObj.getDate() + (direction === 'next' ? 7 : -7));
    
    const newDateString = newDate.toISOString().split('T')[0];
    setCurrentDate(newDateString);
    setWeekDates(getWeekDates(newDate));
  };

  // Calcular estatísticas por hábito
  const getHabitStats = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || !habit.completedDates) return { total: 0, streak: 0 };
    
    const completedDates = Object.entries(habit.completedDates)
      .filter(([_, completed]) => completed)
      .map(([date]) => date)
      .sort();
    
    // Calcular streak atual
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Verificar dias consecutivos
    const oneDayMs = 24 * 60 * 60 * 1000;
    for (let i = completedDates.length - 1; i >= 0; i--) {
      const dateStr = completedDates[i];
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      
      // Se for o primeiro item ou for o dia anterior ao último verificado
      if (i === completedDates.length - 1) {
        // A data deve ser hoje ou ontem para contar como streak
        const diff = today.getTime() - date.getTime();
        if (diff <= oneDayMs) {
          streak = 1;
        } else {
          break; // Streak quebrado
        }
      } else {
        const nextDate = new Date(completedDates[i + 1]);
        nextDate.setHours(0, 0, 0, 0);
        
        const diff = nextDate.getTime() - date.getTime();
        if (diff === oneDayMs) {
          streak++;
        } else {
          break; // Streak quebrado
        }
      }
    }
    
    return {
      total: completedDates.length,
      streak
    };
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      user,
      habits,
      loading,
      weekDates,
      currentDate,
      login,
      register,
      logout,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitCompletion,
      setHabitGoal,
      changeWeek,
      getHabitStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};