import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCharacter } from '@/hooks/useCharacter';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';
import ProgressBar from '@/components/ProgressBar';
import { Siren as Fire, Zap, Trophy, TrendingUp, Heart, Coins } from 'lucide-react-native';
import StatsCard from '@/components/StatsCard';
import { getGreeting } from '@/utils/helpers';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useRoutines } from '@/hooks/useRoutines';
import { Colors, getThemeColors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { character, incrementXP } = useCharacter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const [greeting, setGreeting] = useState('');
  const { workouts } = useWorkouts();
  const { routines } = useRoutines();
  const router = useRouter();
  
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  // Helper to get start of week (Monday)
  function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const workoutsThisWeek = workouts.filter(w => {
    const workoutDate = new Date(w.timestamp);
    return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
  });

  const workoutsToShow = workouts;  //workoutsThisWeek; - to show only this week workouts; fix

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with coin display */}
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: theme.text }]}>Muscledia</Text>
        <View style={styles.coinContainer}>
          <Coins size={20} color={theme.accent} />
          <Text style={[styles.coinText, { color: theme.accent }]}>100</Text>
        </View>
      </View>

      {/* Character Section with Health and Level bars */}
      <View style={[styles.characterSection, { backgroundColor: theme.surface }]}>
        {/* Health Bar */}
        <View style={styles.healthContainer}>
          <Heart size={16} color={theme.health} />
          <Text style={[styles.barLabel, { color: theme.text }]}>Health</Text>
          <ProgressBar 
            progress={0.58} // 29/50 as shown in image
            color={theme.health}
            height={8}
          />
          <Text style={[styles.barText, { color: theme.textSecondary }]}>29/50</Text>
        </View>

        {/* Character Avatar */}
        <View style={styles.avatarContainer}>
          <CharacterAvatar 
            level={character.level} 
            gender={character.gender} 
            streak={character.streak}
            size="large"
          />
          {character.streak >= 3 && (
            <View style={styles.streakIndicator}>
              <Fire size={20} color={theme.streak} />
            </View>
          )}
        </View>

        {/* Level Bar */}
        <View style={styles.levelContainer}>
          <Text style={[styles.levelText, { color: theme.accent }]}>⭐</Text>
          <Text style={[styles.barLabel, { color: theme.text }]}>Level {character.level}</Text>
          <ProgressBar 
            progress={character.xp / character.xpToNextLevel} 
            color={theme.xp}
            height={8}
          />
          <Text style={[styles.barText, { color: theme.textSecondary }]}>
            {character.xp}/{character.xpToNextLevel}
          </Text>
        </View>
      </View>

      {/* Starting Objectives Section */}
      <View style={[styles.goldenCard, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: theme.cardText }]}>Starting Objectives</Text>
        <View style={styles.objectiveProgress}>
          <ProgressBar 
            progress={0.2} // 1/5 as shown in image
            color="#6B46C1"
            height={8}
          />
          <View style={styles.objectiveReward}>
            <Coins size={16} color={theme.cardText} />
            <Text style={[styles.objectiveRewardText, { color: theme.cardText }]}>100</Text>
            <Text style={[styles.objectiveProgressText, { color: theme.cardText }]}>1/5</Text>
          </View>
        </View>
      </View>

      {/* My Routines Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>My Routines ({routines.length})</Text>
      
      {routines.length === 0 ? (
        <TouchableOpacity 
          style={[styles.goldenCard, { backgroundColor: theme.cardBackground }]}
          onPress={() => router.push('/routine-builder')}
        >
          <View style={styles.routineContent}>
            <Text style={[styles.routineTitle, { color: theme.cardText }]}>Create Your First Routine</Text>
            <Text style={[styles.routineDescription, { color: theme.cardText }]}>
              Tap to start building your custom workout routine
            </Text>
          </View>
          <Text style={[styles.routineArrow, { color: theme.cardText }]}>+</Text>
        </TouchableOpacity>
      ) : (
        routines.map((routine) => (
          <TouchableOpacity 
            key={routine.id}
            style={[styles.goldenCard, { backgroundColor: theme.cardBackground }]}
            onPress={() => router.push(`/routine-workout/${routine.id}`)}
          >
            <View style={styles.routineContent}>
              <Text style={[styles.routineTitle, { color: theme.cardText }]}>{routine.name}</Text>
              <Text style={[styles.routineDescription, { color: theme.cardText }]}>
                {routine.exercises.map(ex => ex.name).join(', ')}
              </Text>
              <Text style={[styles.routineSubtext, { color: theme.cardText }]}>
                {routine.exercises.length} exercise{routine.exercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={[styles.routineArrow, { color: theme.cardText }]}>›</Text>
          </TouchableOpacity>
        ))
      )}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthContainer: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 10,
  },
  levelContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  streakIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  barText: {
    fontSize: 11,
    marginTop: 4,
  },
  levelText: {
    fontSize: 16,
    marginBottom: 4,
  },
  goldenCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  objectiveProgress: {
    gap: 8,
  },
  objectiveReward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  objectiveRewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  objectiveProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  routineContent: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routineDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  routineSubtext: {
    fontSize: 11,
    opacity: 0.8,
  },
  routineArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  workoutCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});