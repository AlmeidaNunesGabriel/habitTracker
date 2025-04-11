import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    dayButton: {
      padding: 12,
      marginRight: 8,
      backgroundColor: '#eee',
      borderRadius: 8,
    },
    selectedDayButton: {
      backgroundColor: '#4CAF50',
    },
    dayText: {
      fontSize: 16,
    },
    selectedDayText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    habitList: {
      marginTop: 24,
    },
    habitItem: {
      fontSize: 18,
      marginBottom: 8,
    },
  });
  
  export default styles;