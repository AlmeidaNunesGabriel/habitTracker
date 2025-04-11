// components/HabitCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HabitCard = ({ habit, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(habit)}>
      <Text style={styles.title}>{habit.nome}</Text>
      <Text style={styles.status}>Status: {habit.status}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
});

export default HabitCard;
