import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeProvider } from './src/context/ThemeContext';
import Home from "./src/screens/Home/index.js";
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitListScreen from './src/screens/Lista/index.js';
import Statistics from './src/screens/Estatitisticas/index.js';
import HabitDetails from './src/screens/HabitDetails/index.js';
import Profile from './src/screens/profile/index.js'; 
import Agenda  from './src/screens/Agenda/index.js';
import { HabitsProvider } from './src/context/HabitsContext';
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <HabitsProvider>
    <ThemeProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Início">
          <Drawer.Screen name="Início" component={Home} />
          <Drawer.Screen name="Meus Hábitos" component={HabitListScreen} />
          <Drawer.Screen name="Novo Hábito" component={AddHabitScreen} />
          <Drawer.Screen name="Estatísticas" component={Statistics} />
          <Drawer.Screen name="Detalhes dos Hábitos" component={HabitDetails} />
          <Drawer.Screen name="Perfil" component={Profile} />
          <Drawer.Screen name="Agenda" component={Agenda} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
    </HabitsProvider>
  );
}

