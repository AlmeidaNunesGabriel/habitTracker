import { StyleSheet } from 'react-native';

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: theme.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.subtleText,
    },
    errorContainer: {
      backgroundColor: '#ffebee',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#f44336',
    },
    errorText: {
      color: '#c62828',
      fontSize: 14,
    },
    listContent: {
      paddingVertical: 8,
      flexGrow: 1,
    },
    card: {
      backgroundColor: theme.card,
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: 14,
      color: theme.subtleText,
      marginBottom: 8,
      fontStyle: 'italic',
    },
    cardStatus: {
      fontSize: 16,
      fontWeight: '600',
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    toggleButton: {
      backgroundColor: '#4CAF50',
    },
    deleteButton: {
      backgroundColor: '#f44336',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.subtleText,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

export default getStyles;