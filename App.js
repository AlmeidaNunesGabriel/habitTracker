import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider } from './src/context/ThemeContext';
import { HabitsProvider } from './src/context/HabitsContext';

// Importar screens
import Home from "./src/screens/Home/index.js";
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitListScreen from './src/screens/Lista/index.js';
import Statistics from './src/screens/Estatitisticas/index.js';
import HabitDetails from './src/screens/HabitDetails/index.js';
import Profile from './src/screens/profile/index.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Hábitos (Lista + Detalhes)
function HabitsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Lista" 
        component={HabitListScreen}
        options={{ title: 'Meus Hábitos' }}
      />
      <Stack.Screen 
        name="Detalhes" 
        component={HabitDetails}
        options={{ title: 'Detalhes do Hábito' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Adicionar Hábito
function AddHabitStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Adicionar" 
        component={AddHabitScreen}
        options={{ title: 'Novo Hábito' }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator principal
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = 'home';
          } else if (route.name === 'Hábitos') {
            iconName = 'list';
          } else if (route.name === 'Adicionar') {
            iconName = 'add-circle';
          } else if (route.name === 'Estatísticas') {
            iconName = 'bar-chart';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Início" 
        component={Home}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Hábitos" 
        component={HabitsStack}
        options={{ headerShown: false, title: 'Meus Hábitos' }}
      />
      <Tab.Screen 
        name="Adicionar" 
        component={AddHabitStack}
        options={{ 
          headerShown: false,
          title: 'Adicionar',
          tabBarIconStyle: { marginTop: -5 }
        }}
      />
      <Tab.Screen 
        name="Estatísticas" 
        component={Statistics}
        options={{ title: 'Estatísticas' }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={Profile}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <HabitsProvider>
      <ThemeProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </HabitsProvider>
  );
}