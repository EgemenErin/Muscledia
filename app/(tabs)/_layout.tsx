import { Tabs } from 'expo-router';
import { Chrome as Home, Dumbbell, ShoppingBag, User, Plus } from 'lucide-react-native';
import { useColorScheme, TouchableOpacity, View, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors, getThemeColors } from '@/constants/Colors';

const FloatingActionButton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { width } = Dimensions.get('window');
  
  return (
    <TouchableOpacity
      onPress={() => router.push('/routine-builder')}
      style={{
        position: 'absolute',
        bottom: 55,
        left: width / 2 - 28, // Center horizontally
        backgroundColor: theme.accent,
        width: 56,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        transform: [{ rotate: '45deg' }],
        zIndex: 1000,
      }}
    >
      <View style={{ transform: [{ rotate: '-45deg' }] }}>
        <Plus size={28} color={theme.cardText} />
      </View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
          borderBottomWidth: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Muscledia',
                     headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/profile')}
              style={{ marginLeft: 16 }}
            >
              <User size={24} color={theme.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
          headerTitle: 'Daily Quests',
        }}
      />
      

      
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
          headerTitle: 'Equipment Shop',
        }}
      />
      
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Arena',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
          headerTitle: 'Training Arena',
        }}
      />
      
      <Tabs.Screen
        name="exercises"
        options={{
          href: null,
        }}
      />
    </Tabs>
    <FloatingActionButton />
    </View>
  );
}