// app/index.js
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, habits, completeHabit } = useAppContext();
  
  // Redirecionar para login se não estiver autenticado
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  // Implementação da tela de Metas da Semana aqui
  // ...

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {}}
        >
          <Ionicons name="calendar" size={24} color="#4a90e2" />
          <Text style={[styles.tabText, { color: '#4a90e2' }]}>Metas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/adicionar')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#777" />
          <Text style={styles.tabText}>Adicionar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/detalhes')}
        >
          <Ionicons name="list-outline" size={24} color="#777" />
          <Text style={styles.tabText}>Detalhes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/perfil')}
        >
          <Ionicons name="person-outline" size={24} color="#777" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
      
      {/* Conteúdo da tela de Metas da Semana */}
      {/* ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#777',
  },
  // Outros estilos...
});