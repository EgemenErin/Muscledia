import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      if (isLoading) return;
      const hasOnboarded = await AsyncStorage.getItem('onboarding_complete');
      if (!hasOnboarded) {
        router.replace('/onboarding');
        return;
      }
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    };
    run();
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking auth status
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#6D28D9" />
    </View>
  );
} 