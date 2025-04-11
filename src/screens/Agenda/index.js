import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './styles';

export default function Agenda() {
  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const [selectedDay, setSelectedDay] = useState('Seg');

  const habitData = {
    Seg: ['Meditar', 'Exercitar'],
    Ter: ['Exercitar'],
    Qua: ['Meditar'],
    Qui: ['Ler'],
    Sex: ['Meditar', 'Ler'],
    Sáb: [],
    Dom: ['Exercitar'],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hábitos da Semana</Text>

      <FlatList
        data={daysOfWeek}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dayButton,
              selectedDay === item && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDay(item)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === item && styles.selectedDayText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.habitList}>
        {habitData[selectedDay].length > 0 ? (
          habitData[selectedDay].map((habit, index) => (
            <Text key={index} style={styles.habitItem}>
              ✅ {habit}
            </Text>
          ))
        ) : (
          <Text style={styles.habitItem}>Nenhum hábito registrado</Text>
        )}
      </View>
    </View>
  );
}
