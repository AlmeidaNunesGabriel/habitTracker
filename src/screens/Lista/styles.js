import { StyleSheet } from 'react-native';

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    listContent: {
      paddingVertical: 8,
    },
    card: {
      backgroundColor: theme.card,
      padding: 16,
      marginBottom: 12,
      borderRadius: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    cardStatus: {
      marginTop: 4,
      color: theme.subtleText,
    },
  });

export default getStyles;
