import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "./src/screens/Home/index.js";
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitListScreen from './src/screens/Lista/index.js';


const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Início">
        <Drawer.Screen name="Início" component={Home} />
        <Drawer.Screen name="Meus Hábitos" component={HabitListScreen} />
        <Drawer.Screen name="Novo Hábito" component={AddHabitScreen} />
      
        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
