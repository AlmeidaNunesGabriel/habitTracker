import React, { useContext, useEffect } from 'react';
import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitsContext';
import Loading from '../../components/Loading';
import styles from './styles';

export default function Statistics({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { 
    habits, 
    statistics, 
    loading, 
    error, 
    refreshHabits, 
    updateStatistics 
  } = useHabits();

  useEffect(() => {
    updateStatistics();
  }, [habits]);

  const getMotivationalMessage = () => {
    const { completionRate } = statistics;
    
    if (completionRate === 100) {
      return "🏆 Perfeito! Você completou todos os hábitos!";
    } else if (completionRate >= 80) {
      return "🎯 Excelente! Você está quase lá!";
    } else if (completionRate >= 60) {
      return "💪 Bom trabalho! Continue assim!";
    } else if (completionRate >= 40) {
      return "📈 Você está progredindo, não desista!";
    } else if (completionRate > 0) {
      return "🌱 Todo começo é difícil, mas você consegue!";
    } else {
      return "🚀 Hora de começar sua jornada de hábitos!";
    }
  };

  const StatCard = ({ title, value, subtitle, color = '#6200ee', icon }) => (
    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <View style={styles.statTextContainer}>
          <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          {subtitle && (
            <Text style={[styles.statSubtitle, { color: theme.subtleText }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const ProgressBar = ({ percentage, color = '#4CAF50' }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarBackground, { backgroundColor: theme.card }]}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: theme.text }]}>
        {percentage}%
      </Text>
    </View>
  );

  if (loading && habits.length === 0) {
    return <Loading message="Carregando estatísticas..." />;
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
      <Text style={[styles.title, { color: theme.text }]}>
        Estatísticas dos Hábitos
      </Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Progresso Geral */}
      <View style={[styles.mainProgressCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.progressTitle, { color: theme.text }]}>
          Progresso Geral
        </Text>
        <ProgressBar percentage={statistics.completionRate} />
        <Text style={[styles.motivationalText, { color: theme.subtleText }]}>
          {getMotivationalMessage()}
        </Text>
      </View>

      {/* Cards de Estatísticas */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total de Hábitos"
          value={statistics.total}
          subtitle="cadastrados"
          color="#6200ee"
          icon="📋"
        />
        
        <StatCard
          title="Completados"
          value={statistics.completed}
          subtitle={`de ${statistics.total} hábitos`}
          color="#4CAF50"
          icon="✅"
        />
        
        <StatCard
          title="Pendentes"
          value={statistics.pending}
          subtitle="ainda não feitos"
          color="#FF9800"
          icon="⏳"
        />
        
        <StatCard
          title="Sequência"
          value={`${statistics.streak} dias`}
          subtitle="consecutivos"
          color="#9C27B0"
          icon="🔥"
        />
      </View>

      {/* Hábitos Recentes */}
      {habits.length > 0 && (
        <View style={[styles.recentHabitsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Hábitos Recentes
          </Text>
          
          {habits.slice(0, 5).map((habit, index) => (
            <TouchableOpacity
              key={habit.id}
              style={styles.habitItem}
              onPress={() => navigation.navigate('Hábitos', { 
                screen: 'Detalhes', 
                params: { habit } 
              })}
            >
              <View style={styles.habitInfo}>
                <Text style={[styles.habitName, { color: theme.text }]}>
                  {habit.name}
                </Text>
                <Text style={[styles.habitDescription, { color: theme.subtleText }]}>
                  {habit.description || 'Sem descrição'}
                </Text>
              </View>
              <Text style={[
                styles.habitStatus,
                { color: habit.completed ? '#4CAF50' : '#FF9800' }
              ]}>
                {habit.completed ? '✅' : '⏳'}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Hábitos')}
          >
            <Text style={styles.viewAllText}>Ver todos os hábitos →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Resumo da Semana */}
      <View style={[styles.weekSummaryCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Resumo da Semana
        </Text>
        
        <View style={styles.weekStats}>
          <View style={styles.weekStatItem}>
            <Text style={[styles.weekStatValue, { color: '#4CAF50' }]}>
              {statistics.habitsThisWeek}
            </Text>
            <Text style={[styles.weekStatLabel, { color: theme.subtleText }]}>
              Hábitos praticados
            </Text>
          </View>
          
          <View style={styles.weekStatItem}>
            <Text style={[styles.weekStatValue, { color: '#6200ee' }]}>
              {Math.round(statistics.completionRate)}%
            </Text>
            <Text style={[styles.weekStatLabel, { color: theme.subtleText }]}>
              Taxa de conclusão
            </Text>
          </View>
          
          <View style={styles.weekStatItem}>
            <Text style={[styles.weekStatValue, { color: '#FF9800' }]}>
              {statistics.streak}
            </Text>
            <Text style={[styles.weekStatLabel, { color: theme.subtleText }]}>
              Dias consecutivos
            </Text>
          </View>
        </View>
      </View>

      {/* Dicas e Motivação */}
      <View style={[styles.tipsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          💡 Dica do Dia
        </Text>
        <Text style={[styles.tipText, { color: theme.subtleText }]}>
          {statistics.completionRate < 50 
            ? "Comece pequeno! Escolha 1-2 hábitos e foque neles até se tornarem automáticos."
            : statistics.completionRate < 80
            ? "Você está indo bem! Tente manter a consistência e adicione novos hábitos gradualmente."
            : "Excelente progresso! Continue assim e inspire outros com sua dedicação!"
          }
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}