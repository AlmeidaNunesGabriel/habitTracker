// app/_layout.js
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppProvider } from '../contexts/AppContext';

// Mantém a tela de splash visível enquanto carrega os recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Você pode adicionar fontes personalizadas aqui
  });

  useEffect(() => {
    // Simular carregamento inicial
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="adicionar" options={{ title: "Adicionar Hábito" }} />
        <Stack.Screen name="detalhes" options={{ title: "Hábitos Detalhados" }} />
        <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}