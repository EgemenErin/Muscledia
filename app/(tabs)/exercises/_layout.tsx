import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors, getThemeColors } from '@/constants/Colors';

export default function ExerciseLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Browse Exercises',
          presentation: 'card',
          headerShown: false, // We'll use custom header in the component
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{
          title: 'Exercise Details',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}