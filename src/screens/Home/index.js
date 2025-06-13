import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import MyButton from '../../components/Button';
import Loading from '../../components/Loading';
import styles from './styles';
import { useHabits } from '../../context/HabitsContext';
import { ThemeContext } from '../../context/ThemeContext';

export default function Home({ navigation }) {
  const { habits, loading, refreshHabits } = useHabits();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    refreshHabits();
  }, []);

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const getMotivationalMessage = () => {
    if (totalHabits === 0) {
      return "Comece adicionando seu primeiro hábito! 🌱";
    }
    
    if (completionPercentage === 100) {
      return "Parabéns! Todos os hábitos completados! 🎉";
    } else if (completionPercentage >= 75) {
      return "Você está indo muito bem! Continue assim! 💪";
    } else if (completionPercentage >= 50) {
      return "Bom progresso! Você está no caminho certo! 👍";
    } else if (completionPercentage > 0) {
      return "Todo progresso conta! Continue se esforçando! 🌟";
    } else {
      return "Hora de começar! Você consegue! 🚀";
    }
  };

  const getEmoji = () => {
    if (completionPercentage === 100) return "🏆";
    if (completionPercentage >= 75) return "🎯";
    if (completionPercentage >= 50) return "📈";
    if (completionPercentage > 0) return "⭐";
    return "🌱";
  };

  if (loading && habits.length === 0) {
    return <Loading message="Carregando seus hábitos..." />;
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshHabits}
          colors={['#6200ee']}
        />
      }
    >
      <View style={styles.welcomeSection}>
        <Text style={[styles.title, { color: theme.text }]}>
          Bem-vindo de volta!
        </Text>
        
        <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statsEmoji, { fontSize: 48 }]}>
            {getEmoji()}
          </Text>
          
          <Text style={[styles.statsText, { color: theme.text }]}>
            {totalHabits > 0 
              ? `${completedHabits} de ${totalHabits} hábitos completados`
              : "Nenhum hábito cadastrado"
            }
          </Text>
          
          {totalHabits > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${completionPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={[styles.percentageText, { color: theme.text }]}>
                {completionPercentage}%
              </Text>
            </View>
          )}
          
          <Text style={[styles.motivationalText, { color: theme.subtleText }]}>
            {getMotivationalMessage()}
          </Text>
        </View>
      </View>

      {habits.length > 0 && (
        <View style={styles.quickStatsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Resumo Rápido
          </Text>
          
          <View style={styles.quickStatsContainer}>
            <View style={[styles.quickStatCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.quickStatNumber, { color: '#4CAF50' }]}>
                {completedHabits}
              </Text>
              <Text style={[styles.quickStatLabel, { color: theme.subtleText }]}>
                Completados
              </Text>
            </View>
            
            <View style={[styles.quickStatCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.quickStatNumber, { color: '#FF9800' }]}>
                {totalHabits - completedHabits}
              </Text>
              <Text style={[styles.quickStatLabel, { color: theme.subtleText }]}>
                Pendentes
              </Text>
            </View>
            
            <View style={[styles.quickStatCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.quickStatNumber, { color: '#6200ee' }]}>
                {totalHabits}
              </Text>
              <Text style={[styles.quickStatLabel, { color: theme.subtleText }]}>
                Total
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <MyButton 
          title="Ver Meus Hábitos" 
          onPress={() => navigation.navigate('Hábitos')}
          color="#6200ee"
        />
        <MyButton 
          title="Adicionar Novo Hábito" 
          onPress={() => navigation.navigate('Adicionar')}
          color="#4CAF50"
        />
        <MyButton 
          title="Estatísticas" 
          onPress={() => navigation.navigate('Estatísticas')}
          color="#FF9800"
        />
      </View>
    </ScrollView>
  );
}