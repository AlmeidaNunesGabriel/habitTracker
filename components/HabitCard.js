import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HabitCard({ habit, onPress }) {
  return (
    <TouchableOpacity style={styles.habitCard} onPress={onPress}>
      <Text style={styles.habitCardTitle}>{habit.name}</Text>
      {habit.description ? (
        <Text style={styles.habitCardDescription} numberOfLines={2}>
          {habit.description}
        </Text>
      ) : null}
      <View style={styles.habitCardDays}>
        {Object.keys(habit.daysOfWeek).map((day) => (
          habit.daysOfWeek[day] && (
            <Text key={day} style={styles.habitCardDay}>
              {day.charAt(0).toUpperCase()}
            </Text>
          )
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilos específicos do componente
});