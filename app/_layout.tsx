import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CharacterProvider } from '@/hooks/useCharacter';
import { WorkoutsProvider } from '@/hooks/useWorkouts';
import { RoutineProvider } from '@/hooks/useRoutines';
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <WorkoutsProvider>
        <RoutineProvider>
          <CharacterProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </CharacterProvider>
        </RoutineProvider>
      </WorkoutsProvider>
    </AuthProvider>
  );
}